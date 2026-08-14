import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./layout.css";

// Every route rendered inside this Layout automatically gets the same
// header and footer. The page-specific content (Home, Products, etc.)
// renders wherever <Outlet /> sits, via App.jsx's route nesting.
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
