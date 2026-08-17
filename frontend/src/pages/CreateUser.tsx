import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "rep",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload.role) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      if (payload.role !== "admin") {
        navigate("/leads");
      }
    } catch (e) {
      console.error("Error decoding token:", e);
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      await axios.post("http://localhost:8000/auth/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate("/leads");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          navigate("/");
        } else if (err.response?.status === 403) {
          setError(
            "You don't have permission to create users. Admin access required.",
          );
        } else {
          setError(err.response?.data?.detail || "Failed to create user");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "11px 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    backgroundColor: "white",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FB",
        padding: "32px",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/leads")}
          style={{
            marginBottom: "22px",
            backgroundColor: "transparent",
            border: "none",
            color: "#4F46E5",
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
          }}
        >
          ← Back to Leads
        </button>

        <div style={{ marginBottom: "24px" }}>
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
              margin: "4px 0 0",
              fontSize: "30px",
              letterSpacing: "-0.03em",
            }}
          >
            Create New User
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Add a sales representative or administrator.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "26px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {error && (
            <div
              style={{
                color: "#B91C1C",
                padding: "11px 12px",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="full_name" style={labelStyle}>
                Full Name *
              </label>

              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="email" style={labelStyle}>
                Email *
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="password" style={labelStyle}>
                Password *
              </label>

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={inputStyle}
              />

              <small
                style={{
                  display: "block",
                  marginTop: "6px",
                  color: "#9CA3AF",
                  fontSize: "12px",
                }}
              >
                Minimum 6 characters
              </small>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="role" style={labelStyle}>
                Role *
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="rep">Sales Rep</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "11px 16px",
                backgroundColor: loading ? "#A5B4FC" : "#4F46E5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
