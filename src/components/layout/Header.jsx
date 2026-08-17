import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Layout.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isLoggedIn, username, user, signOut } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `rs-nav-link${isActive ? " rs-nav-link-active" : ""}`;

  const initial = (username || user?.email || "?").charAt(0).toUpperCase();

  async function handleLogout() {
    setProfileOpen(false);
    await signOut();
    navigate("/");
  }

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
        <NavLink to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>
          Products
        </NavLink>
        <NavLink to="/favorites" className={linkClass} onClick={() => setMenuOpen(false)}>
          Favorites
        </NavLink>
        <NavLink to="/history" className={linkClass} onClick={() => setMenuOpen(false)}>
          History
        </NavLink>
      </div>

      <div className="rs-nav-actions">
        {isLoggedIn ? (
          <div className="rs-profile">
            <button
              className="rs-profile-avatar"
              onClick={() => setProfileOpen((open) => !open)}
              aria-label="Account menu"
              aria-expanded={profileOpen}
            >
              {initial}
            </button>

            {profileOpen && (
              <>
                <div className="rs-profile-backdrop" onClick={() => setProfileOpen(false)} />
                <div className="rs-profile-menu">
                  <div className="rs-profile-menu-name">{username || "Account"}</div>
                  <button className="rs-profile-menu-item" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="rs-btn rs-btn-ghost">
              Login
            </Link>
            <Link to="/register" className="rs-btn rs-btn-primary">
              Sign Up
            </Link>
          </>
        )}

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