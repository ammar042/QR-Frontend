import { useCallback, useEffect, useState } from "react";
import styles from "./ComplaintsPanel.module.css";
import { API_URL } from "../../config/api";

export default function ComplaintsPanel({ token }) {
  const [complaints, setComplaints] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/complaints`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load messages.");
      setComplaints(data.complaints || []);
      setError("");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function reply(item) {
    const response = (drafts[item._id] ?? item.response ?? "").trim();
    if (!response) return setError("Write a reply before sending.");
    setError(""); setNotice("");
    try {
      const res = await fetch(`${API_URL}/api/admin/complaints/${item._id}/reply`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send reply.");
      setComplaints((items) => items.map((entry) => entry._id === item._id ? data.complaint : entry));
      setNotice(data.deliveryErrors?.length ? `Reply saved; delivery issue: ${data.deliveryErrors.join("; ")}` : `Reply delivered by email${data.complaint.responseSmsSent ? " and SMS" : ""}.`);
    } catch (err) { setError(err.message); }
  }

  const visible = complaints.filter((item) => filter === "all" || item.status === filter);
  return <section className={styles.panel}>
    <header className={styles.header}><div><span>SUPPORT INBOX</span><h3>Contact messages</h3><p>Review requests and reply directly to the sender.</p></div><button onClick={load} className={styles.refresh}>Refresh</button></header>
    <div className={styles.filters}>{["all", "open", "responded"].map((key) => <button key={key} className={filter === key ? styles.selected : ""} onClick={() => setFilter(key)}>{key === "all" ? `All (${complaints.length})` : `${key === "open" ? "Open" : "Responded"} (${complaints.filter((item) => item.status === key).length})`}</button>)}</div>
    {error && <p className={styles.error}>{error}</p>}{notice && <p className={styles.notice}>{notice}</p>}
    {loading ? <p className={styles.empty}>Loading contact messages…</p> : visible.length === 0 ? <p className={styles.empty}>No messages in this view yet.</p> : <div className={styles.list}>
      {visible.map((item) => <article className={styles.item} key={item._id}>
        <div className={styles.itemTop}><div><span className={`${styles.status} ${item.status === "open" ? styles.open : styles.responded}`}>{item.status}</span><h4>{item.subject}</h4></div><time>{new Date(item.createdAt).toLocaleString()}</time></div>
        <div className={styles.sender}><b>{item.name}</b><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a href={`tel:${item.phone}`}>{item.phone}</a>}</div>
        <p className={styles.message}>{item.message}</p>
        {item.response && <div className={styles.previous}><b>Last reply</b><p>{item.response}</p><small>Email {item.responseEmailSent ? "sent" : "not delivered"}{item.phone ? ` · SMS ${item.responseSmsSent ? "sent" : "not delivered"}` : ""}</small></div>}
        <label className={styles.replyLabel}>Reply<textarea rows="3" maxLength={5000} value={drafts[item._id] ?? item.response ?? ""} onChange={(e) => setDrafts((all) => ({ ...all, [item._id]: e.target.value }))} placeholder="Write a helpful response…" /></label>
        <button className={styles.send} onClick={() => reply(item)}>Save and send reply</button>
      </article>)}
    </div>}
  </section>;
}
