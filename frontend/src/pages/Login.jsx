
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiTrendingUp,
  FiCreditCard,
  FiUsers,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  const navigate = useNavigate();

  const DEMO_ACCOUNTS = {
    accounts: {
      username: "admin_demo",
      password: "Admin@12345",
    },
    parent: {
      username: ["parent_aarav", "parent_ishita", "parent_mohit"],
      password: "Parent@123",
    },
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/token/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      const userResponse = await api.get("/auth/me/");
      localStorage.setItem("user", JSON.stringify(userResponse.data));

      if (userResponse.data.role === "ACCOUNTS") {
        navigate("/dashboard");
      } else if (userResponse.data.role === "PARENT") {
        navigate("/parent");
      } else {
        setError("Invalid account role.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // COPY CREDENTIALS
  const copyCredential = async (field, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);

      setTimeout(() => {
        setCopiedField("");
      }, 1800);
    } catch (err) {
      console.error("Unable to copy credential:", err);
    }
  };

  // DEMO CREDENTIAL ROW
  const renderCredential = (role, field, value) => {
    const key = `${role}-${field}`;

    return (
      <div className="demo-credential-row" key={key}>
        <div className="demo-credential-info">
          <strong>
            {field === "username" ? "Username:" : "Password:"} {value}
          </strong>
        </div>

        <button
          type="button"
          className="demo-copy-button"
          onClick={() => copyCredential(key, value)}
        >
          {copiedField === key ? <FiCheck /> : <FiCopy />}
          {copiedField === key ? "Copied" : "Copy"}
        </button>
      </div>
    );
  };

  // DEMO ACCOUNT CARD
  const renderDemoAccount = (role, title, Icon, iconClass) => {
    const account = DEMO_ACCOUNTS[role];

    return (
      <div className="demo-account-card">
        <div className="demo-account-title">
          <div className={`demo-role-icon ${iconClass}`}>
            <Icon />
          </div>

          <div>
            <h4>{title}</h4>
          </div>
        </div>

        {renderCredential(
          role,
          "username",
          Array.isArray(account.username)
          ? account.username.join(", ")
          : account.username
        )}

        {renderCredential(role, "password", account.password)}
      </div>
    );
  };

  return (
    <main className="login-container">
      {/* LEFT BRANDING PANEL */}
      <section className="login-brand-panel">
        <div className="brand-content">
          <div className="brand-logo">
            <div className="brand-logo-icon">
              <FiBookOpen />
            </div>
            <span>EduLedger</span>
          </div>

          <div className="brand-message">
            <span className="brand-tagline">
              EDUCATION FINANCE, SIMPLIFIED
            </span>

            <h1>
              Clarity in every
              <br />
              <span>fee transaction.</span>
            </h1>

            <p>
              Manage student fees, monitor payments and keep
              every financial record organized in one place.
            </p>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="brand-dashboard-preview">
            <div className="preview-header">
              <div>
                <span className="preview-eyebrow">OVERVIEW</span>
                <h3>Fee Management</h3>
              </div>

              <div className="preview-status">
                <span />
                Live
              </div>
            </div>

            <div className="preview-stats">
              <div className="preview-stat">
                <div className="preview-stat-icon">
                  <FiCreditCard />
                </div>
                <span>Total Payments</span>
                <strong>Payments tracked</strong>
                <small>In one organized place</small>
              </div>

              <div className="preview-stat">
                <div className="preview-stat-icon purple">
                  <FiUsers />
                </div>
                <span>Student Records</span>
                <strong>Easy to manage</strong>
                <small>Clear payment history</small>
              </div>
            </div>

            <div className="preview-activity">
              <div className="activity-icon">
                <FiCheckCircle />
              </div>

              <div className="activity-copy">
                <strong>Payment records organized</strong>
                <span>Stay on top of every update</span>
              </div>

              <FiTrendingUp className="activity-trend" />
            </div>
          </div>

          <div className="brand-bottom">
            <div className="brand-bottom-icon">
              <FiShield />
            </div>
            <span>Reliable records. Better transparency.</span>
          </div>
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="mobile-brand-logo">
            <div className="brand-logo-icon">
              <FiBookOpen />
            </div>
            <span>EduLedger</span>
          </div>

          <form className="login-card" onSubmit={handleLogin}>
            {/* LOGIN HEADING */}
            <div className="login-heading">
              <h2>Sign in to EduLedger</h2>
            </div>

            {/* USERNAME */}
            <div className="login-field">
              <label htmlFor="username">Username</label>

              <div className="login-input-wrapper">
                <FiUser className="login-input-icon" />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="login-field">
              <label htmlFor="password">Password</label>

              <div className="login-input-wrapper">
                <FiLock className="login-input-icon" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              {!loading && <FiArrowRight />}
            </button>

            {/* DEMO ACCOUNTS */}
            <div className="demo-access-section">
              <div className="demo-access-heading">
                <div className="demo-heading-icon">
                  <FiShield />
                </div>

                <div>
                  <h3>Demo Accounts</h3>
                </div>
              </div>

              {renderDemoAccount(
                "accounts",
                "Accounts Executive",
                FiUsers,
                "accounts-icon"
              )}

              {renderDemoAccount(
                "parent",
                "Parent Account",
                FiUser,
                "parent-icon"
              )}
            </div>
          </form>

          <p className="login-copyright">
            © {new Date().getFullYear()} EduLedger. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
