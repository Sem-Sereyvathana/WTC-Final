import "./product.css";

// A single card, driven entirely by props. Nothing in here is
// hardcoded to a specific product — reuse it for every item by
// passing different data (see products.js + ProductsPage.jsx).
export default function ProductCard({ product }) {
const { name, price, description, image, badge, inStock = true } = product;

return (
    <div className="pc-card">
        {badge && <span className="pc-badge">{badge}</span>}

        <img className="pc-icon" src={image} alt={name} />

        <h3 className="pc-name">{name}</h3>
        <p className="pc-description">{description}</p>

        <div className="pc-footer">
            <span className="pc-price">${price}</span>
            <button className="pc-btn" disabled={!inStock}>
            {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
        </div>
    </div>
);
}
