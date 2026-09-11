import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ScanResult.module.css";

const FIELD_LABELS = [
  ["name", "Name"],
  ["bloodGroup", "Blood Group"],
  ["age", "Age"],
  ["district", "District"],
  ["province", "Province"],
  ["phone", "Phone"],
  ["lastDonation", "Last Donation"],
  ["healthIssues", "Health Issues"],
  ["currentMedications", "Current Medications"],
  ["recentSurgery", "Recent Surgery"],
  ["smoker", "Smoker"],
  ["alcoholic", "Alcoholic"],
  ["allergies", "Allergies"],
];

export default function scanResult() {
  const [searchParams] = useSearchParams();

  const { donor, error } = useMemo(() => {
    const raw = searchParams.get("data");
    if (!raw) return { donor: null, error: "No donor data found in this QR code." };
    try {
      const json = decodeURIComponent(atob(raw));
      return { donor: JSON.parse(json), error: null };
    } catch (e) {
      return { donor: null, error: "This QR code could not be read." };
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Donor Profile</h1>
        <p className={styles.subtitle}>Scanned from donor QR code</p>

        <div
          className={`${styles.eligBadge} ${
            donor.eligible ? styles.eligible : styles.notEligible
          }`}
        >
          {donor.eligible
            ? "✓ Eligible to Donate"
            : `✗ Eligible in ${donor.daysUntilEligible} days`}
        </div>

        <table className={styles.table}>
          <tbody>
            {FIELD_LABELS.map(([key, label]) => (
              <tr key={key}>
                <th>{label}</th>
                <td>{String(donor[key] ?? "—")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}