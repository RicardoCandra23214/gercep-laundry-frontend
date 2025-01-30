import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/login.css"; // Pastikan file CSS diimport

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Login berhasil!");
        // Simpan token atau status login ke localStorage
        localStorage.setItem("isLoggedIn", true);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login gagal. Periksa email dan password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan pada server. Silakan coba lagi.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <p>Khusus untuk pemilik Gercep Laundry</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p>dudu@gmail.com dan dudu123 -- untuk login</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
