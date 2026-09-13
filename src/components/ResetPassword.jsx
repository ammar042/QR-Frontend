import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";
import { API_URL } from "../config/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, formData);
      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles["login-container"]} ${styles["reset-container"]}`}>
      <div className={styles["login-card"]}>
        <h2>Password Reset</h2>
        <p>Choose a new password for your QR Based Blood Donation account.</p>
        {error && <div className={styles["error-message"]}>{error}</div>}
        {success && <div className={styles["success-message"]}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              minLength="6"
              required
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              value={formData.confirmPassword}
              onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
              minLength="6"
              required
            />
          </div>
          <button type="submit" disabled={loading || Boolean(success)}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
        <div className={styles["register-link"]}>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
