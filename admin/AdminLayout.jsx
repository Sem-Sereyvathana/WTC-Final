import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import AdminSidebar from "./AdminSidebar";
import "./admin.css";

export default function AdminLayout() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <div className="ad-loading">Checking access…</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ad-shell">
      <AdminSidebar />
      <main className="ad-main">
        <Outlet />
      </main>
    </div>
  );
}