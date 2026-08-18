import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase_client";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import "./product.css";

const LOW_STOCK_THRESHOLD = 5;

function ModalPortal({ children }) {
  return createPortal(children, document.body);
}

export default function ProductCard({ product }) {
  const { name, price, description, image, badge, stockCount } = product;
  const hasStockData = typeof stockCount === "number";

  const [localStock, setLocalStock] = useState(stockCount);
  useEffect(() => {
    setLocalStock(stockCount);
  }, [stockCount]);

  const currentStock = hasStockData ? localStock : undefined;
  const inStock = hasStockData ? currentStock > 0 : product.inStock ?? true;
  const lowStock = hasStockData && currentStock > 0 && currentStock <= LOW_STOCK_THRESHOLD;

  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const [flowStep, setFlowStep] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [result, setResult] = useState(null); // { email, password } | { noCredential: true } | null
  const [copiedField, setCopiedField] = useState(null);
  const [justBought, setJustBought] = useState(false);

  useEffect(() => {
    if (!flowStep) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [flowStep]);

  function handleHeartClick() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    toggleFavorite(product.id);
  }

  function handleBuyClick() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!inStock || flowStep) return;
    setPurchaseError(null);
    setResult(null);
    setFlowStep("confirm");
  }

  function closeFlow() {
    if (checkingPayment) return; 
    setFlowStep(null);
    setPurchaseError(null);
    setCopiedField(null);
    if (result) {
      setJustBought(true);
      setTimeout(() => setJustBought(false), 2000);
    }
    setResult(null);
  }

  function handleCopy(field, value) {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  async function completePurchase() {
    setCheckingPayment(true);
    setPurchaseError(null);

    await new Promise((resolve) => setTimeout(resolve, 1400));

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total: price, status: "completed" })
      .select()
      .single();

    if (orderError) {
      setCheckingPayment(false);
      setPurchaseError("Couldn't record your order. Please try again.");
      console.error("Order failed:", orderError.message);
      return;
    }

    const { data: orderItem, error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: product.id,
        quantity: 1,
        price,
      })
      .select()
      .single();

    if (itemError) {
      setCheckingPayment(false);
      setPurchaseError("Couldn't record your order. Please try again.");
      console.error("Order item failed:", itemError.message);
      return;
    }

    const { error: credError } = await supabase.rpc("claim_account_credential", {
      p_product_id: product.id,
      p_order_item_id: orderItem.id,
    });
    if (credError && !credError.message.includes("No credentials available")) {
      console.error("Credential claim failed:", credError.message);
    }

    const { data: credRow } = await supabase
      .from("account_credentials")
      .select("email, password")
      .eq("assigned_order_item_id", orderItem.id)
      .maybeSingle();

    if (hasStockData) {
      const { error: stockError } = await supabase.rpc("decrement_product_stock", {
        p_product_id: product.id,
        p_quantity: 1,
      });

      if (stockError) {
        console.error("Stock update failed:", stockError.message);
      } else {
        setLocalStock((prev) => Math.max(prev - 1, 0));
      }
    }

    setCheckingPayment(false);
    setResult(credRow ? { email: credRow.email, password: credRow.password } : { noCredential: true });
    setFlowStep("result");
  }

  return (
    <div className="pc-card">
      {badge && <span className="pc-badge">{badge}</span>}

      <button
        type="button"
        className={`pc-heart ${favorite ? "pc-heart-active" : ""}`}
        onClick={handleHeartClick}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={favorite}
      >
        <svg viewBox="0 0 24 24" className="pc-heart-icon">
          <path d="M12 21s-6.7-4.35-9.33-8.36C.86 9.94 1.6 6.6 4.36 5.06c2.2-1.23 4.86-.6 6.29 1.36l1.35 1.85 1.35-1.85c1.43-1.96 4.09-2.59 6.29-1.36 2.76 1.54 3.5 4.88 1.69 7.58C18.7 16.65 12 21 12 21z" />
        </svg>
      </button>

      <img className="pc-icon" src={image} alt={name} />

      <h3 className="pc-name">{name}</h3>
      <p className="pc-description">{description}</p>

      {hasStockData && (
        <p className={`pc-stock ${lowStock ? "pc-stock-low" : ""} ${!inStock ? "pc-stock-out" : ""}`}>
          {inStock
            ? lowStock
              ? `Only ${currentStock} left in stock`
              : `${currentStock} in stock`
            : "Out of stock"}
        </p>
      )}

      <div className="pc-footer">
        <span className="pc-price">${price}</span>
        <button className="pc-btn" disabled={!inStock || !!flowStep} onClick={handleBuyClick}>
          {justBought ? "Purchased ✓" : inStock ? "Buy Now" : "Out of Stock"}
        </button>
      </div>

      {flowStep === "confirm" && (
        <ModalPortal>
          <div className="pc-modal-backdrop" onClick={closeFlow}>
            <div className="pc-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="pc-modal-title">Confirm your purchase</h2>
              <p className="pc-modal-subtitle">Double check before you pay.</p>

              <div className="pc-confirm-product">
                <img className="pc-confirm-img" src={image} alt={name} />
                <div className="pc-confirm-info">
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
              </div>

              <div className="pc-modal-value pc-confirm-total">
                <span>Total</span>
                <span className="pc-confirm-price">${price}</span>
              </div>

              <div className="pc-modal-actions">
                <button type="button" className="pc-modal-btn-secondary" onClick={closeFlow}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="pc-btn pc-modal-btn-primary"
                  onClick={() => setFlowStep("payment")}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {flowStep === "payment" && (
        <ModalPortal>
          <div className="pc-modal-backdrop" onClick={closeFlow}>
            <div className="pc-modal" onClick={(e) => e.stopPropagation()}>
              <span className="pc-demo-badge">DEMO PAYMENT</span>
              <h2 className="pc-modal-title">Scan to pay</h2>
              <p className="pc-modal-subtitle">
                Please pay within time limit!
              </p>

              <div className="pc-khqr-box">
                <div className="pc-khqr-placeholder" />
                <p className="pc-khqr-merchant">{name}</p>
                <p className="pc-khqr-amount">${price}</p>
              </div>

              {purchaseError && <p className="pc-state-error pc-payment-error">{purchaseError}</p>}

              <div className="pc-modal-actions">
                <button
                  type="button"
                  className="pc-modal-btn-secondary"
                  onClick={closeFlow}
                  disabled={checkingPayment}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="pc-btn pc-modal-btn-primary"
                  onClick={completePurchase}
                  disabled={checkingPayment}
                >
                  {checkingPayment ? (
                    <>
                      <span className="pc-spinner" /> Checking payment...
                    </>
                  ) : purchaseError ? (
                    "Try Again"
                  ) : (
                    "Confirm Payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {flowStep === "result" && result && (
        <ModalPortal>
          <div className="pc-modal-backdrop" onClick={closeFlow}>
            <div className="pc-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="pc-modal-title">Payment successful 🎉</h2>

              {result.noCredential ? (
                <p className="pc-modal-subtitle">
                  {name} is yours — no login is needed for this one, or the credential pool is
                  empty right now. Check your History page later if that changes.
                </p>
              ) : (
                <>
                  <p className="pc-modal-subtitle">Here's your login for {name}.</p>

                  <div className="pc-modal-field">
                    <label>Email</label>
                    <div className="pc-modal-value">
                      <span>{result.email}</span>
                      <button type="button" onClick={() => handleCopy("email", result.email)}>
                        {copiedField === "email" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="pc-modal-field">
                    <label>Password</label>
                    <div className="pc-modal-value">
                      <span>{result.password}</span>
                      <button type="button" onClick={() => handleCopy("password", result.password)}>
                        {copiedField === "password" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button type="button" className="pc-modal-close" onClick={closeFlow}>
                Close
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
