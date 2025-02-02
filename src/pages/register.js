import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("karyawan"); // Default role
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://backend-gerceplaundry.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });
      if (response.ok) {
        alert("Registrasi berhasil!");
        navigate("/login");
      } else {
        const data = await response.json();
        alert(data.message || "Registrasi gagal.");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Terjadi kesalahan pada server.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        {/* Judul Registrasi */}
        <h1>Register</h1>

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="karyawan">Karyawan</option>
          <option value="pemilik">Pemilik</option>
        </select>
        <button type="submit">Register</button>

        {/* Link ke Halaman Login */}
        <div>
          <p>
            Sudah punya akun?{" "}
            <a
              href="/login"
              style={{ textDecoration: "none", color: "#0bacc1" }}
            >
              Silahkan Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
