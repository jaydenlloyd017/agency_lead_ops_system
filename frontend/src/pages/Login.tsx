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
        }
      );
      console.log("Login successful:", response.data);

      // Store the token in localStorage
      localStorage.setItem("token", response.data.access_token);

      navigate("/Leads");
      setLoginSuccess(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Login failed:", error);
      setLoginSuccess(false);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Submit</button>
        </form>
        {loginSuccess && <p>Login succeeded!</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </>
  );
}
