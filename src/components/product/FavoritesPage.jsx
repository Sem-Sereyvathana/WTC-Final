import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase_client";
import { useAuth } from "../../hooks/useAuth";
import ProductCard from "./ProductCard";
import "./product.css";

// Maps a Supabase "products" row -> the shape ProductCard expects.
// Kept in sync with ProductsPage.jsx's mapRow().
function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    image: row.image_url,
    badge: row.badge ?? null,
    stockCount: row.stock,
  };
}

export default function FavoritesPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      if (!isLoggedIn || !user?.id) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: favRows, error: favError } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", user.id);

      if (cancelled) return;

      if (favError) {
        setError(favError.message);
        setProducts([]);
        setLoading(false);
        return;
      }

      const ids = (favRows ?? []).map((r) => r.product_id);
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data, error: productsError } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);

      if (cancelled) return;

      if (productsError) {
        setError(productsError.message);
        setProducts([]);
      } else {
        setProducts((data ?? []).map(mapRow));
      }
      setLoading(false);
    }

    if (!authLoading) loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.id, authLoading]);

  return (
    <section className="pc-page">
      <div className="pc-page-header">
        <h1>Your Favorites</h1>
        <p>Products you've hearted, all in one place.</p>
      </div>

      {!authLoading && !isLoggedIn && (
        <p className="pc-state-text">
          <Link to="/login">Log in</Link> to see your favorites.
        </p>
      )}

      {isLoggedIn && loading && <p className="pc-state-text">Loading favorites...</p>}

      {isLoggedIn && !loading && error && (
        <p className="pc-state-text pc-state-error">Couldn't load favorites: {error}</p>
      )}

      {isLoggedIn && !loading && !error && products.length === 0 && (
        <p className="pc-state-text">
          No favorites yet — tap the heart on any product to save it here.
        </p>
      )}

      {isLoggedIn && !loading && !error && products.length > 0 && (
        <div className="pc-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
