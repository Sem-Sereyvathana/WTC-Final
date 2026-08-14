import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./layout.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rs-nav-link${isActive ? " rs-nav-link-active" : ""}`;

  return (
    <nav className="rs-navbar">
      <Link to="/" className="rs-logo" onClick={() => setMenuOpen(false)}>
        <span className="rs-logo-badge">🛡️</span>
        <span className="rs-logo-text">
          ITE<span className="rs-logo-accent">Store</span>
        </span>
      </Link>

      <div className={`rs-nav-links ${menuOpen ? "rs-nav-links-open" : ""}`}>
        <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
          Home
        </NavLink>
        {/* Update this path once your Products route exists in App.jsx */}
        <NavLink to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>
          Products
        </NavLink>
      </div>

      <div className="rs-nav-actions">
        {/* Update this path once your Login route is uncommented in App.jsx */}
        <Link to="/login" className="rs-btn rs-btn-ghost">
          Login
        </Link>
        <Link to="/register" className="rs-btn rs-btn-primary">
          Sign Up
        </Link>

        <button
          className="rs-menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
