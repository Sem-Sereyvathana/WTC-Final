import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase_client";
import { useAuth } from "../../hooks/useAuth";
import "./product.css";

export default function HistoryPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [credentials, setCredentials] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewing, setViewing] = useState(null); 
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!isLoggedIn || !user?.id) {
        setItems([]);
        setCredentials({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: historyError } = await supabase
        .from("order_items")
        .select(
          "id, quantity, price, product_id, orders!inner(id, user_id, status, created_at), products(name, image_url)"
        )
        .eq("orders.user_id", user.id)
        .order("created_at", { foreignTable: "orders", ascending: false });

      if (cancelled) return;

      if (historyError) {
        setError(historyError.message);
        setItems([]);
        setLoading(false);
        return;
      }

      setItems(data ?? []);

      const itemIds = (data ?? []).map((item) => item.id);
      if (itemIds.length > 0) {
        const { data: credRows, error: credError } = await supabase
          .from("account_credentials")
          .select("assigned_order_item_id, email, password")
          .in("assigned_order_item_id", itemIds);

        if (!cancelled && !credError && credRows) {
          const map = {};
          for (const row of credRows) {
            map[row.assigned_order_item_id] = { email: row.email, password: row.password };
          }
          setCredentials(map);
        }
      } else {
        setCredentials({});
      }

      setLoading(false);
    }

    if (!authLoading) loadHistory();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.id, authLoading]);

  function handleCopy(field, value) {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  function closePanel() {
    setViewing(null);
    setCopiedField(null);
  }

  return (
    <section className="pc-page">
      
      {!authLoading && !isLoggedIn && (
        <p className="pc-state-text">
          <Link to="/login">Log in</Link> to see your purchase history.
        </p>
      )}

      {isLoggedIn && loading && <p className="pc-state-text">Loading history...</p>}

      {isLoggedIn && !loading && error && (
        <p className="pc-state-text pc-state-error">Couldn't load history: {error}</p>
      )}

      {isLoggedIn && !loading && !error && items.length === 0 && (
        <p className="pc-state-text">No purchases yet — items you buy will show up here.</p>
      )}

      {isLoggedIn && !loading && !error && items.length > 0 && (
        <div className="pc-history-list">
          {items.map((item) => {
            const productName = item.products?.name ?? "Product no longer available";
            const productImage = item.products?.image_url;
            const purchasedAt = item.orders?.created_at;
            const credential = credentials[item.id];

            return (
              <div className="pc-history-row" key={item.id}>
                {productImage && (
                  <img className="pc-history-img" src={productImage} alt={productName} />
                )}
                <div className="pc-history-info">
                  <h3>{productName}</h3>
                  <p>
                    {purchasedAt ? new Date(purchasedAt).toLocaleString() : ""}
                    {item.quantity > 1 ? ` · qty ${item.quantity}` : ""}
                  </p>
                </div>
                <span className="pc-history-price">${item.price}</span>
                {credential && (
                  <button
                    type="button"
                    className="pc-view-btn"
                    onClick={() =>
                      setViewing({ name: productName, email: credential.email, password: credential.password })
                    }
                  >
                    View
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {viewing && (
        <div className="pc-modal-backdrop" onClick={closePanel}>
          <div className="pc-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="pc-modal-title">{viewing.name}</h2>
            <p className="pc-modal-subtitle">Your login for this account</p>

            <div className="pc-modal-field">
              <label>Email</label>
              <div className="pc-modal-value">
                <span>{viewing.email}</span>
                <button type="button" onClick={() => handleCopy("email", viewing.email)}>
                  {copiedField === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="pc-modal-field">
              <label>Password</label>
              <div className="pc-modal-value">
                <span>{viewing.password}</span>
                <button type="button" onClick={() => handleCopy("password", viewing.password)}>
                  {copiedField === "password" ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <button type="button" className="pc-modal-close" onClick={closePanel}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
