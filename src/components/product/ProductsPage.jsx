import ProductCard from "./ProductCard";
import products from "./products";
import "./product.css";

export default function ProductsPage() {
  return (
    <section className="pc-page">
      <div className="pc-page-header">
        <h1>Our Products</h1>
        <p>Browse all digital products — instant delivery, secure payment.</p>
      </div>

      <div className="pc-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
