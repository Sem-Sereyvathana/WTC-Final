import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./homedesign.css";

// Header and Footer now come from Layout.jsx and wrap this component
// automatically via App.jsx routing — this file only needs the
// page-specific hero content.
export default function WebsiteHome() {
  const { isLoggedIn, username } = useAuth();

  return (
    <header className="rs-hero">
      <div className="rs-hero-left">
        <div className="rs-badge">
          <span className="rs-badge-icon">⚡</span>
          Cambodia&apos;s #1 Digital Store
        </div>

        <h1 className="rs-headline">Premium <span className="rs-accent-text">Digital</span> 
          <span className="rs-accent-text"> Products</span> Instant
          
          Delivery
        </h1>
        
        <p className="rs-subtext">
          {isLoggedIn
            ? `Welcome back${username ? `, ${username}` : ""} — browse the latest digital products below.`
            : "Get instant access to premium software, games, and digital products. Pay securely with KHQR."}
        </p>

        <div className="rs-cta-row">
          <Link to="/products" className="rs-btn rs-btn-primary rs-btn-lg">
            <CartIcon /> Browse Products
          </Link>
          {!isLoggedIn && (
            <Link to="/register" className="rs-btn rs-btn-dark rs-btn-lg">
              <UserPlusIcon /> Get Started
            </Link>
          )}
        </div>

        <div className="rs-stats">
          <div className="rs-stat">
            <div className="rs-stat-num">19+</div>
            <div className="rs-stat-label">Products</div>
          </div>
          <div className="rs-stat">
            <div className="rs-stat-num">973+</div>
            <div className="rs-stat-label">Orders</div>
          </div>
          <div className="rs-stat">
            <div className="rs-stat-num">24/7</div>
            <div className="rs-stat-label">Support</div>
          </div>
        </div>
      </div>

      <div className="rs-hero-right">
        <div className="rs-card">
          <div className="rs-card-header">
            <div className="rs-card-icon">
              <ShieldIcon />
            </div>
            <div>
              <div className="rs-card-title">Secure &amp; Fast</div>
              <div className="rs-card-subtitle">Trusted by thousands</div>
            </div>
          </div>

          <ul className="rs-card-list">
            <li>
              <CheckIcon /> Instant Digital Delivery
            </li>
            <li>
              <CheckIcon /> KHQR Payment Support
            </li>
            <li>
              <CheckIcon /> 100% Authentic Keys
            </li>
            <li>
              <CheckIcon /> 24/7 Customer Support
            </li>
            <li>
              <CheckIcon /> Money Back Guarantee
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

/* --- inline icons (no extra dependency needed) --- */

function CartIcon() {
  return (
    <svg className="rs-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 4h2l2.4 12.2A2 2 0 0 0 9.36 18h7.28a2 2 0 0 0 1.96-1.6L20 8H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" />
      <circle cx="17" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg className="rs-icon" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3.5 19c.7-3 3-4.6 5.5-4.6s4.8 1.6 5.5 4.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.5 8v5M16 10.5h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="rs-icon-lg" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="rs-check" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.15" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}