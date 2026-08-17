import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase_client";
import { useAuth } from "../../hooks/useAuth";
import "./product.css";

// Pulls every order_item that belongs to one of the current user's
// orders, along with the parent order (for date/status) and the
// product (for name/image) it points to. "orders!inner" makes the
// user_id filter below apply as a real join condition rather than
// just filtering after the fact.
export default function HistoryPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!isLoggedIn || !user?.id) {
        setItems([]);
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
      } else {
        setItems(data ?? []);
      }
      setLoading(false);
    }

    if (!authLoading) loadHistory();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.id, authLoading]);

  return (
    <section className="pc-page">
      <div className="pc-page-header">
        <h1>Purchase History</h1>
        <p>Everything you've bought, most recent first.</p>
      </div>

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
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
