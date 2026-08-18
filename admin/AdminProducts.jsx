import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";
import "./admin.css";

const TABLE_NAME = "products";

const emptyForm = {
  id: null,
  name: "",
  price: "",
  description: "",
  image_url: "",
  badge: "",
  stock: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  async function loadProducts() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from(TABLE_NAME).select("*").order("name");

    if (error) {
      setError(error.message);
      setProducts([]);
    } else {
      setProducts(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAddForm() {
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(product) {
    setForm({
      id: product.id,
      name: product.name ?? "",
      price: product.price ?? "",
      description: product.description ?? "",
      image_url: product.image_url ?? "",
      badge: product.badge ?? "",
      stock: product.stock ?? "",
    });
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      image_url: form.image_url,
      badge: form.badge || null,
      stock: Number(form.stock),
    };

    const { error } = form.id
      ? await supabase.from(TABLE_NAME).update(payload).eq("id", form.id)
      : await supabase.from(TABLE_NAME).insert(payload);

    if (error) {
      setFormError(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setFormOpen(false);
    loadProducts();
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This can't be undone.`
    );
    if (!confirmed) return;

    setDeleteError(null);
    setDeletingId(product.id);

    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", product.id);

    setDeletingId(null);

    if (error) {
      setDeleteError(error.message);
      return;
    }

    loadProducts();
  }

  return (
    <section className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1>Manage Products</h1>
          <p>Add new listings or update price, stock, and details.</p>
        </div>
        <button type="button" className="ad-btn-primary" onClick={openAddForm}>
          + Add Product
        </button>
      </div>

      {loading && <p className="ad-state-text">Loading products...</p>}

      {!loading && error && (
        <p className="ad-state-text ad-state-error">Couldn't load products: {error}</p>
      )}

      {deleteError && (
        <p className="ad-state-text ad-state-error">Couldn't delete product: {deleteError}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="ad-state-text">No products yet.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="ad-card">
          <table className="ad-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badge</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.image_url && <img className="ad-thumb" src={p.image_url} alt="" />}</td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.badge || "—"}</td>
                  <td>
                    <button type="button" className="ad-btn-ghost" onClick={() => openEditForm(p)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ad-btn-ghost ad-btn-danger"
                      onClick={() => handleDelete(p)}
                      disabled={deletingId === p.id}
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="ad-modal-backdrop" onClick={closeForm}>
          <form className="ad-modal ad-form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <h2 className="ad-modal-title">{form.id ? "Edit product" : "Add product"}</h2>
            <p className="ad-modal-subtitle">
              {form.id ? "Update the details below." : "Fill in the details for the new listing."}
            </p>

            <label className="ad-field">
              <span>Name</span>
              <input required value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            </label>

            <label className="ad-field">
              <span>Price ($)</span>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
              />
            </label>

            <label className="ad-field">
              <span>Stock</span>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
              />
            </label>

            <label className="ad-field">
              <span>Image URL</span>
              <input value={form.image_url} onChange={(e) => updateField("image_url", e.target.value)} />
            </label>

            <label className="ad-field">
              <span>Badge (optional)</span>
              <input
                value={form.badge}
                onChange={(e) => updateField("badge", e.target.value)}
                placeholder="e.g. Best Seller"
              />
            </label>

            <label className="ad-field">
              <span>Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </label>

            {formError && <p className="ad-state-text ad-state-error">{formError}</p>}

            <div className="ad-modal-actions">
              <button type="button" className="ad-btn-secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="ad-btn-primary" disabled={saving}>
                {saving ? "Saving..." : form.id ? "Save changes" : "Add product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}