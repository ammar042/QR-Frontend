import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import Footer from "../components/Footer";
import styles from "./ContactUs.module.css";

const INITIAL = { name: "", phone: "", email: "", subject: "General inquiry", message: "" };

export default function ContactUs() {
  const [form, setForm] = useState(INITIAL);
  const [state, setState] = useState({ busy: false, error: "", success: "" });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setState({ busy: true, error: "", success: "" });
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your message.");
      setForm(INITIAL);
      setState({ busy: false, error: "", success: "Thanks for contacting us. Your message has been sent to our admin team." });
    } catch (error) {
      setState({ busy: false, error: error.message || "Unable to send your message.", success: "" });
    }
  }

  return (
    <>
      <main className={styles.page}>
        <header className={styles.hero}>
          <span>QR BLOOD DONATION</span>
          <h1>Contact Us</h1>
          <p>Questions, feedback, or a concern? Our team is here to help.</p>
        </header>
        <section className={styles.content}>
          <div className={styles.details}>
            <span className={styles.kicker}>WE ARE HERE FOR YOU</span>
            <h2>Get in touch</h2>
            <p>Send a message and our admin team will review it. Add your phone number if you would also like a text reply.</p>
            <a href="mailto:qr.blood.donation@gmail.com"><span>✉</span><div><b>Email support</b><small>qr.blood.donation@gmail.com</small></div></a>
            <a href="tel:+923257848300"><span>☎</span><div><b>Call support</b><small>0325 7848300</small></div></a>
            <div className={styles.note}><b>What happens next?</b><p>Your message is saved securely for the admin team. Replies are sent to the email you provide, and to your phone when SMS is available.</p></div>
            <Link to="/">← Back to home</Link>
          </div>

          <form className={styles.form} onSubmit={submit}>
            <div className={styles.formHeading}><span>SUPPORT</span><h2>Send a message</h2><p>Fields marked * are required.</p></div>
            {state.error && <div className={styles.alertError} role="alert">{state.error}</div>}
            {state.success && <div className={styles.alertSuccess} role="status">{state.success}</div>}
            <div className={styles.fields}>
              <label>Your name *<input name="name" value={form.name} onChange={update} required maxLength={100} placeholder="Your name" /></label>
              <label>Phone number <span>(optional)</span><input name="phone" type="tel" value={form.phone} onChange={update} maxLength={30} placeholder="+92 300 0000000" /></label>
              <label>Email address *<input name="email" type="email" value={form.email} onChange={update} required maxLength={254} placeholder="you@example.com" /></label>
              <label>Subject *<select name="subject" value={form.subject} onChange={update} required><option>General inquiry</option><option>Complaint</option><option>Account support</option><option>Blood request support</option><option>Feedback</option><option>Other</option></select></label>
              <label className={styles.full}>Message *<textarea name="message" value={form.message} onChange={update} required maxLength={5000} rows={6} placeholder="How can we help you?" /></label>
            </div>
            <button className={styles.submit} type="submit" disabled={state.busy}>{state.busy ? "Sending…" : "Send message  →"}</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
