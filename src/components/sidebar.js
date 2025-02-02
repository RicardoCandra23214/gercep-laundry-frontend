import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./css/sidebar.css";
import { FaHome, FaUser, FaBox, FaTools } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Hapus status login
    navigate("/"); // Arahkan ke halaman login
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Gercep Laundry</h2>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaHome size={20} style={{ marginRight: "10px" }} />Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/karyawan"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaUser size={20} style={{ marginRight: "10px" }} />Karyawan
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaBox size={20} style={{ marginRight: "10px" }} />Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/services"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaTools size={20} style={{ marginRight: "10px" }} />Services
          </NavLink>
        </li>
      </ul>
        <button onClick={handleLogout}>Logout</button>  
    </div>
  );
};

export default Sidebar;
