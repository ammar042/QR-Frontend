import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "./AdminReportsCard.module.css";

const PERIODS = [
  { label: "Today", value: "daily" },
  { label: "This Week", value: "weekly" },
  { label: "This Month", value: "monthly" },
  { label: "This Year", value: "yearly" },
  { label: "Custom", value: "custom" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function AdminReportsCard({ token, organizations = [] }) {
  const [period, setPeriod] = useState("monthly");
  const [organizationId, setOrganizationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    if (period === "custom" && (!startDate || !endDate)) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const params = new URLSearchParams({ period });
      if (organizationId) params.set("organizationId", organizationId);
      if (period === "custom") {
        params.set("start", startDate);
        params.set("end", endDate);
      }

      const res = await fetch(`/api/admin/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate report.");
        return;
      }
      setReport(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const scopeName = organizationId
      ? (organizations.find((o) => o._id === organizationId)?.organizationName || "Organization")
      : "All Organizations";
    const { summary, donations, dispenses, currentStock } = report;

    doc.setFillColor(159, 18, 57);
    doc.rect(0, 0, pageWidth, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Blood Needer", 14, 13);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Admin Report", 14, 22);
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(scopeName, 14, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Report Period: ${new Date(report.period.startDate).toLocaleDateString()} — ${new Date(report.period.endDate).toLocaleDateString()}`,
      14, 49
    );
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 55);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, 66);
    autoTable(doc, {
      startY: 70,
      head: [["Metric", "Value"]],
      body: [
        ["Total Organizations", summary.totalOrganizations],
        ["Total Donors", summary.totalDonors],
        ["Eligible Donors", summary.eligibleDonors],
        ["Donations Recorded", summary.totalDonations],
        ["Blood Collected (ml)", `${summary.totalMlRecorded} ml`],
        ["Dispenses", summary.totalDispenses],
        ["Blood Dispensed (ml)", `${summary.totalMlDispensed} ml`],
        ["Net Change in Stock", `${summary.netStock >= 0 ? "+" : ""}${summary.netStock} ml`],
      ],
      headStyles: { fillColor: [159, 18, 57], textColor: 255 },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      styles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right" } },
    });

    let y = doc.lastAutoTable.finalY + 10;
    doc.text("Blood Group Breakdown", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [["Blood Group", "Collected (ml)", "Dispensed (ml)", "Current Stock (ml)"]],
      body: BLOOD_GROUPS.map((bg) => [
        bg,
        summary.donationsByBloodGroup[bg] || 0,
        summary.dispensesByBloodGroup[bg] || 0,
        currentStock[bg] || 0,
      ]),
      headStyles: { fillColor: [159, 18, 57], textColor: 255 },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      styles: { fontSize: 9 },
    });

    y = doc.lastAutoTable.finalY + 10;
    if (donations.length) {
      doc.text(`All Donation Records (${donations.length})`, 14, y);
      autoTable(doc, {
        startY: y + 4,
        head: [["Date", "Donor", "Blood", "Units (ml)", "Organization"]],
        body: donations.map((d) => [
          d.date, d.donorName, d.bloodGroup, d.units, d.orgName,
        ]),
        headStyles: { fillColor: [159, 18, 57], textColor: 255 },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        styles: { fontSize: 7.5 },
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (dispenses.length) {
      doc.text(`All Dispense Records (${dispenses.length})`, 14, y);
      autoTable(doc, {
        startY: y + 4,
        head: [["Date", "Organization", "Blood", "Units (ml)", "Recipient"]],
        body: dispenses.map((d) => [
          d.date, d.organizationName, d.bloodGroup, d.units, d.recipientName,
        ]),
        headStyles: { fillColor: [69, 10, 10], textColor: 255 },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        styles: { fontSize: 7.5 },
      });
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Blood Needer — Admin Report — Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: "center" }
      );
    }

    const safeName = scopeName.replace(/[^a-z0-9-_]+/gi, "_");
    doc.save(`Admin_Report_${safeName}_${period}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3>📊 Reports</h3>
          <p>Download reports for all donors, donations, blood stock and dispenses.</p>
        </div>
        {report && <button className={styles.downloadBtn} onClick={downloadPDF}>⬇ Download PDF</button>}
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Report Scope</label>
          <select value={organizationId} onChange={(e) => setOrganizationId(e.target.value)}>
            <option value="">All Organizations</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>{org.organizationName}</option>
            ))}
          </select>
        </div>

        <div className={styles.periodRow}>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={period === p.value ? styles.periodActive : styles.periodBtn}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {period === "custom" && (
        <div className={styles.dateRow}>
          <label>From <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
          <label>To <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
        </div>
      )}

      <button className={styles.generateBtn} onClick={fetchReport} disabled={loading}>
        {loading ? "Generating…" : "Generate Report"}
      </button>
      {error && <p className={styles.error}>{error}</p>}

      {report && (
        <div className={styles.preview}>
          <div className={styles.previewTitle}>
            <strong>{organizationId ? "Organization Report" : "All Organizations Report"}</strong>
            <span>
              {new Date(report.period.startDate).toLocaleDateString()} —{" "}
              {new Date(report.period.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className={styles.summaryGrid}>
            {[
              ["Organizations", report.summary.totalOrganizations],
              ["Donors", report.summary.totalDonors],
              ["Eligible", report.summary.eligibleDonors],
              ["Donations", report.summary.totalDonations],
              ["Collected", `${report.summary.totalMlRecorded} ml`],
              ["Dispenses", report.summary.totalDispenses],
              ["Dispensed", `${report.summary.totalMlDispensed} ml`],
            ].map(([label, value]) => (
              <div className={styles.summaryItem} key={label}>
                <strong>{value}</strong><span>{label}</span>
              </div>
            ))}
          </div>

          <h4>Blood Group Breakdown</h4>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Blood</th><th>Collected</th><th>Dispensed</th><th>Current Stock</th></tr></thead>
              <tbody>
                {BLOOD_GROUPS.map((bg) => (
                  <tr key={bg}>
                    <td>{bg}</td>
                    <td>{report.summary.donationsByBloodGroup[bg] || 0} ml</td>
                    <td>{report.summary.dispensesByBloodGroup[bg] || 0} ml</td>
                    <td>{report.currentStock[bg] || 0} ml</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4>Donation Records ({report.donations.length})</h4>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Date</th><th>Donor</th><th>Blood</th><th>Units</th><th>Organization</th></tr></thead>
              <tbody>
                {report.donations.slice(0, 100).map((d, i) => (
                  <tr key={`${d.donorId}-${d.date}-${i}`}>
                    <td>{d.date}</td><td>{d.donorName}</td><td>{d.bloodGroup}</td><td>{d.units} ml</td><td>{d.orgName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.donations.length > 100 && <small>Showing first 100 records in preview. The PDF contains all records.</small>}
          </div>

          <h4>Dispense Records ({report.dispenses.length})</h4>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Date</th><th>Organization</th><th>Blood</th><th>Units</th><th>Recipient</th></tr></thead>
              <tbody>
                {report.dispenses.slice(0, 100).map((d, i) => (
                  <tr key={`${d.organizationId}-${d.date}-${i}`}>
                    <td>{d.date}</td><td>{d.organizationName}</td><td>{d.bloodGroup}</td><td>{d.units} ml</td><td>{d.recipientName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.dispenses.length > 100 && <small>Showing first 100 records in preview. The PDF contains all records.</small>}
          </div>
        </div>
      )}
    </div>
  );
}
