import { Link } from "react-router-dom";
import "./about.css";

export default function AboutUs() {
  return (
    <section className="au-page">
      <div className="au-hero">
        

        <h1 className="au-title">
          Your trusted spot for <span className="au-accent">premium digital accounts</span>
        </h1>

        <p className="au-subtext">
          ITEStore is a Cambodia-based digital storefront for subscription and account-based
          products — streaming, AI tools, design software, and more — delivered instantly and
          paid for securely with KHQR.
        </p>

        <div className="au-hero-actions">
          <Link to="/products" className="rs-btn rs-btn-primary rs-btn-lg">
            Browse Products
          </Link>
          <a href="mailto:admin@itestore.com" className="rs-btn rs-btn-dark rs-btn-lg">
            Contact Admin
          </a>
        </div>
      </div>

      <div className="au-section">
        <h2 className="au-section-title">Why buy from us</h2>
        <p className="au-section-subtitle">
          A few things we take seriously on every order.
        </p>

        <div className="au-feature-grid">
          <div className="au-feature-card">
            <div className="au-feature-icon">
              <BoltIcon />
            </div>
            <h3>Instant Delivery</h3>
            <p>Most orders hand over login details the moment payment is confirmed — no waiting around.</p>
          </div>

          <div className="au-feature-card">
            <div className="au-feature-icon">
              <QrIcon />
            </div>
            <h3>KHQR Payments</h3>
            <p>Pay the way you already do everywhere else in Cambodia — scan, confirm, done.</p>
          </div>

          <div className="au-feature-card">
            <div className="au-feature-icon">
              <ShieldIcon />
            </div>
            <h3>Authentic Accounts</h3>
            <p>Every credential comes from a real, working account — not a shared password floating around online.</p>
          </div>

          <div className="au-feature-card">
            <div className="au-feature-icon">
              <ChatIcon />
            </div>
            <h3>Real Support</h3>
            <p>Something not working? Message the admin directly — no ticket queue, no bot.</p>
          </div>
        </div>
      </div>

      <div className="au-section">
        <h2 className="au-section-title">How it works</h2>
        <p className="au-section-subtitle">Three steps, start to finish.</p>

        <div className="au-steps">
          <div className="au-step">
            <span className="au-step-num">1</span>
            <h3>Pick a product</h3>
            <p>Browse the catalog and find the plan you want — prices and stock are always up to date.</p>
          </div>
          <div className="au-step">
            <span className="au-step-num">2</span>
            <h3>Pay with KHQR</h3>
            <p>Confirm your order, scan the QR code, and pay securely in a few taps.</p>
          </div>
          <div className="au-step">
            <span className="au-step-num">3</span>
            <h3>Get your login</h3>
            <p>Your account details show up right away — and stay saved in your History page too.</p>
          </div>
        </div>
      </div>

      <div className="au-cta">
        <h2>Questions before you buy?</h2>
        <p>Reach out any time — we're happy to help.</p>
        <div className="au-cta-contacts">
          <a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://t.me/yourusername" target="_blank" rel="noreferrer">Telegram</a>
          <a href="mailto:admin@itestore.com">Email</a>
        </div>
      </div>
    </section>
  );
}

function BoltIcon() {
  return (
    <svg className="au-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg className="au-icon" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="au-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M8.5 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="au-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12c0 4-3.8 7-8.5 7-1 0-2-.13-2.9-.38L4 20l1.3-3.7C4.47 15 4 13.6 4 12c0-4 3.8-7 8.5-7S21 8 21 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
