import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/token",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      localStorage.setItem("token", response.data.access_token);

      navigate("/Leads");
      setLoginSuccess(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Login failed:", error);
      setLoginSuccess(false);
      setErrorMessage("Login failed. Please check your details.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 16px",
              borderRadius: "12px",
              backgroundColor: "#4F46E5",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            A
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: 600,
            }}
          >
            Agency Lead Operations
          </p>

          <h1
            style={{
              margin: "6px 0 0",
              fontSize: "28px",
              letterSpacing: "-0.03em",
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Sign in to manage your leads
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "28px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            {errorMessage && (
              <div
                style={{
                  marginBottom: "18px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#B91C1C",
                  fontSize: "13px",
                }}
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "11px 16px",
                backgroundColor: "#4F46E5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </form>

          {loginSuccess && (
            <p
              style={{
                marginTop: "16px",
                color: "#15803D",
                textAlign: "center",
              }}
            >
              Login succeeded!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
