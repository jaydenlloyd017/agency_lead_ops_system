import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateLead() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    source: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // If role is missing from token, force re-login
      if (!payload.role) {
        console.log("Role missing from token, forcing re-login");
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

      await axios.post("http://localhost:8000/api/leads", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Success - redirect to leads list
      navigate("/leads");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          navigate("/");
        } else if (err.response?.status === 403) {
          setError(
            "You don't have permission to create leads. Admin access required.",
          );
        } else {
          setError(err.response?.data?.detail || "Failed to create lead");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/leads")}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Leads
      </button>

      <h1>Create New Lead</h1>

      {error && (
        <p
          style={{
            color: "red",
            padding: "10px",
            backgroundColor: "#fee",
            borderRadius: "4px",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="full_name"
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="phone"
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Phone (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="07123456789"
            pattern="07\d{9}"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          />
          <small style={{ color: "#6b7280" }}>Format: 07XXXXXXXXX</small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="source"
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Source (Optional)
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="">-- Select Source --</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="facebook">Facebook</option>
            <option value="instagram ads">Instagram Ads</option>
            <option value="google ads">Google Ads</option>
            <option value="linkedin">LinkedIn</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 16px",
            backgroundColor: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Creating..." : "Create Lead"}
        </button>
      </form>
    </div>
  );
}
