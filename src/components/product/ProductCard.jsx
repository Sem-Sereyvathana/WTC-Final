import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase_client";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
import "./product.css";

// A single card, driven entirely by props. Nothing in here is
// hardcoded to a specific product — reuse it for every item by
// passing different data (see products.js + ProductsPage.jsx).
//
// The heart icon and "Buy Now" purchase-recording are built into this
// template itself, so every card gets them automatically — nothing to
// add per-product in products.js.

// stockCount is the real number of units left. inStock is derived from
// it automatically (0 = out of stock) unless you explicitly pass inStock.
const LOW_STOCK_THRESHOLD = 5;

export default function ProductCard({ product }) {
  const { name, price, description, image, badge, stockCount } = product;
  const hasStockData = typeof stockCount === "number";

  // Local copy of stock so the card can update itself instantly after
  // a purchase, without waiting on the parent page to refetch. Stays
  // in sync if the parent ever passes a fresh stockCount (e.g. after
  // a manual reload of ProductsPage).
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

  const [buying, setBuying] = useState(false);
  const [justBought, setJustBought] = useState(false);

  function handleHeartClick() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    toggleFavorite(product.id);
  }

  async function handleBuy() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!inStock || buying) return;

    setBuying(true);

    // 1. Create the order (one order per "Buy Now" click, qty 1).
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total: price, status: "completed" })
      .select()
      .single();

    if (orderError) {
      setBuying(false);
      console.error("Order failed:", orderError.message);
      return;
    }

    // 2. Attach the line item to that order.
    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price,
    });

    if (itemError) {
      setBuying(false);
      console.error("Order item failed:", itemError.message);
      return;
    }

    // 3. Decrement stock via a Postgres function (see
    //    decrement-stock-function.sql) instead of an UPDATE from the
    //    client, so buyers can't just overwrite stock to any number.
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

    setBuying(false);
    setJustBought(true);
    setTimeout(() => setJustBought(false), 2000);
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

      {/* `image` can be any image/GIF URL (e.g. one you copied from
          Google Images) or a local import from src/assets/products/ —
          see products.js for both patterns. */}
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
        <button className="pc-btn" disabled={!inStock || buying} onClick={handleBuy}>
          {justBought ? "Purchased ✓" : buying ? "Processing..." : inStock ? "Buy Now" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
