import { Link } from "react-router-dom";
import "./layout.css";

export default function Footer() {
  return (
    <footer className="rs-footer">
      <div className="rs-footer-top">
        <div className="rs-footer-brand">
          <div className="rs-logo">
            <span className="rs-logo-badge">🛡️</span>
            <span className="rs-logo-text">
              ITE<span className="rs-logo-accent">Store</span>
            </span>
          </div>
          <p className="rs-footer-tagline">
            Premium digital products, delivered instantly. Pay securely with
            KHQR.
          </p>
        </div>

        <div className="rs-footer-links">
          <div className="rs-footer-col">
            <h4>Store</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
          </div>
          <div className="rs-footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>

      <div className="rs-footer-bottom">
        <span>© {new Date().getFullYear()} ITE Store. All rights reserved.</span>
      </div>
    </footer>
  );
}
