import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/hooks/useAuth";

export default function AdminSidebar() {
  const { username, signOut } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `ad-nav-link${isActive ? " ad-nav-link-active" : ""}`;

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <aside className="ad-sidebar">
      <Link to="/" className="ad-logo">
        <span className="ad-logo-badge">🛡️</span>
        <span>
          ITE<span className="ad-logo-accent">Store</span>
        </span>
      </Link>
      <span className="ad-sidebar-tag">Admin</span>

      <nav className="ad-nav">
        <NavLink to="/admin/accounts" className={linkClass}>
          <UsersIcon /> Manage Accounts
        </NavLink>
        <NavLink to="/admin/products" className={linkClass}>
          <BoxIcon /> Manage Products
        </NavLink>
      </nav>

      <div className="ad-sidebar-footer">
        <div className="ad-sidebar-user">{username || "Admin"}</div>
        <button type="button" className="ad-sidebar-link ad-signout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}

function UsersIcon() {
  return (
    <svg className="ad-nav-icon" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3.5 19c.7-3 3-4.6 5.5-4.6s4.8 1.6 5.5 4.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15.5 7.5a3.2 3.2 0 0 1 0 6.2M18.5 19c-.5-2.2-1.8-3.7-3.6-4.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg className="ad-nav-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M3.5 7.5 12 3l8.5 4.5V16.5L12 21l-8.5-4.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}