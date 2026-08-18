import "./Layout.css";

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
          <div className="rs-footer-col rs-footer-contact">
            
            <a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer">
              Facebook: ITE Store
            </a>
            <a href="https://t.me/yourusername" target="_blank" rel="noreferrer">
              Telegram: @ITE_STORE
            </a>
            <a href="mailto:admin@itestore.com">Email: itestore@gmail.com</a>
          </div>
        </div>
      </div>

      <div className="rs-footer-bottom">
        <span>© {new Date().getFullYear()} ITE Store. All rights reserved.</span>
      </div>
    </footer>
  );
}
