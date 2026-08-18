import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";
import "./admin.css";

export default function AdminAccounts() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [viewingUser, setViewingUser] = useState(null); 
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfiles() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, role, created_at")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setProfiles([]);
      } else {
        setProfiles(data ?? []);
      }
      setLoading(false);
    }

    loadProfiles();
    return () => {
      cancelled = true;
    };
  }, []);

  async function openHistory(profile) {
    setViewingUser(profile);
    setHistory([]);
    setHistoryError(null);
    setHistoryLoading(true);

    const { data, error } = await supabase
      .from("order_items")
      .select(
        "id, quantity, price, orders!inner(id, user_id, status, created_at), products(name, image_url)"
      )
      .eq("orders.user_id", profile.id)
      .order("created_at", { foreignTable: "orders", ascending: false });

    if (error) {
      setHistoryError(error.message);
    } else {
      setHistory(data ?? []);
    }
    setHistoryLoading(false);
  }

  function closeHistory() {
    setViewingUser(null);
  }

  const filtered = profiles.filter((p) =>
    (p.username ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="ad-page">
      <div className="ad-page-header">
        <div>
          <h1>Manage Accounts</h1>
          <p>Every registered customer — open one to check what they've bought.</p>
        </div>
        <input
          className="ad-search"
          placeholder="Search username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="ad-state-text">Loading accounts...</p>}

      {!loading && error && (
        <p className="ad-state-text ad-state-error">Couldn't load accounts: {error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="ad-state-text">No accounts found.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="ad-card">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.username || "—"}</td>
                  <td>
                    <span className={`ad-role-badge ${p.role === "admin" ? "ad-role-admin" : ""}`}>
                      {p.role || "user"}
                    </span>
                  </td>
                  <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                  <td>
                    <button type="button" className="ad-btn-ghost" onClick={() => openHistory(p)}>
                      View buy history
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewingUser && (
        <div className="ad-modal-backdrop" onClick={closeHistory}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="ad-modal-title">{viewingUser.username || "Customer"}'s purchases</h2>
            <p className="ad-modal-subtitle">Every order this account has placed.</p>

            {historyLoading && <p className="ad-state-text">Loading...</p>}

            {!historyLoading && historyError && (
              <p className="ad-state-text ad-state-error">{historyError}</p>
            )}

            {!historyLoading && !historyError && history.length === 0 && (
              <p className="ad-state-text">No purchases yet.</p>
            )}

            {!historyLoading && !historyError && history.length > 0 && (
              <div className="ad-history-list">
                {history.map((item) => (
                  <div className="ad-history-row" key={item.id}>
                    {item.products?.image_url && (
                      <img className="ad-history-img" src={item.products.image_url} alt="" />
                    )}
                    <div className="ad-history-info">
                      <h4>{item.products?.name ?? "Product no longer available"}</h4>
                      <p>
                        {item.orders?.created_at ? new Date(item.orders.created_at).toLocaleString() : ""}
                        {item.quantity > 1 ? ` · qty ${item.quantity}` : ""}
                        {item.orders?.status ? ` · ${item.orders.status}` : ""}
                      </p>
                    </div>
                    <span className="ad-history-price">${item.price}</span>
                  </div>
                ))}
              </div>
            )}

            <button type="button" className="ad-modal-close" onClick={closeHistory}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
