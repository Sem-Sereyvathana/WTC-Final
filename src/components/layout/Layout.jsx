import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./layout.css";

export default function LayoutPage() {
  return (
    <div className="rs-page">
      <Header />
      <main className="rs-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
