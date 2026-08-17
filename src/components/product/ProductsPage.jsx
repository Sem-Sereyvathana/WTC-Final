import { useEffect, useState } from "react";
import { supabase } from "../../../supabase_client";
import ProductCard from "./ProductCard";
import "./product.css";

// Reading from a Supabase table called "products". Adjust TABLE_NAME
// and the column names in mapRow() below to match your actual schema
// (Table Editor in the Supabase dashboard shows the real column names).
const TABLE_NAME = "products";

// Maps one Supabase row -> the shape ProductCard expects.
// Change the right-hand side (row.xxx) to match your real column names.
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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.from(TABLE_NAME).select("*");

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setProducts([]);
      } else {
        setProducts((data ?? []).map(mapRow));
      }
      setLoading(false);
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="pc-page">
      <div className="pc-page-header">
        <h1>Our Products</h1>
        <p>Browse all digital products — instant delivery, secure payment.</p>
      </div>

      {loading && <p className="pc-state-text">Loading products...</p>}

      {!loading && error && (
        <p className="pc-state-text pc-state-error">
          Couldn't load products: {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="pc-state-text">No products yet.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="pc-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}