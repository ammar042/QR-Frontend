import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";
import logo from "../assets/Vector.png";

const PHONE_DISPLAY = "0325 7848300";
const PHONE_TEL = "+923257848300";
const WHATSAPP_URL = "https://wa.me/923257848300";
const EMAIL = "qr.blood.donation@gmail.com";

/* ---------- Small inline SVG icons (no extra package needed) ---------- */
const IconBase = ({ children }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ChatIcon = () => (
  <IconBase>
    <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
  </IconBase>
);

const MailIcon = () => (
  <IconBase>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </IconBase>
);

const PhoneIcon = () => (
  <IconBase>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </IconBase>
);

const DropIcon = () => (
  <IconBase>
    <path d="M12 2.7s6 6.3 6 10.8a6 6 0 0 1-12 0C6 9 12 2.7 12 2.7z" />
  </IconBase>
);

const ArrowIcon = () => (
  <IconBase>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </IconBase>
);

const Footer = () => {
  const navigate = useNavigate();

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <footer className={styles.footer}>
      {/* ---------- CTA card ---------- */}
      <div className={styles.cta}>
        <div className={styles.ctaText}>
          <span className={styles.eyebrow}>SAVE A LIFE TODAY</span>
          <h3>Ready to become a lifesaver?</h3>
          <p>Register as a donor, find a match nearby, and help someone in need.</p>
        </div>

        <div className={styles.ctaActions}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ghostBtn}
          >
            Talk to support
          </a>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => navigate("/register-donor")}
          >
            Donate Blood <DropIcon />
          </button>
        </div>
      </div>

      {/* ---------- Main footer content ---------- */}
      <div className={styles.footerContent}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandRow}>
            <span className={styles.logoBox}>
              <img src={logo} alt="QR Blood Donation logo" />
            </span>
            <span className={styles.brandName}>QR Blood Donation</span>
          </div>
          <p>
            Find, connect, and donate blood — a smarter, QR-based way to save
            lives.
          </p>

          <div className={styles.socials}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
            >
              <ChatIcon />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              aria-label="Send us an email"
              title="Send us an email"
            >
              <MailIcon />
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              aria-label="Call us"
              title="Call us"
            >
              <PhoneIcon />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className={styles.column}>
          <h4>QUICK LINKS</h4>
          <Link to="/">Home</Link>
          <Link to="/find-blood">Find Blood</Link>
          <Link to="/register-donor">Get Started</Link>
          <Link to="/login">Sign In</Link>
        </div>

        {/* Company */}
        <div className={styles.column}>
          <h4>COMPANY</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* Contact */}
        <div className={styles.column} id="contact">
          <h4>GET IN TOUCH</h4>
          <a href={`tel:${PHONE_TEL}`} className={styles.contactItem}>
            <PhoneIcon />
            <span>{PHONE_DISPLAY}</span>
          </a>
          <a href={`mailto:${EMAIL}`} className={styles.contactItem}>
            <MailIcon />
            <span>{EMAIL}</span>
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactItem}
          >
            <ChatIcon />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className={styles.footerBottom}>
        <p>
          © {new Date().getFullYear()} QR Blood Donation. All rights reserved. ·
          Developed by Ammar Malik — Punjab University
        </p>
      </div>
    </footer>
  );
};

export default Footer;
