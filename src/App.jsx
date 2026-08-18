import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import WebsiteHome from "./components/homepage/home"
import LoginForm from "./components/regandlog/login"
import RegisterForm from "./components/regandlog/register"
import LayoutPage from "./components/layout/Layout"
import ProductsPage from "./components/product/ProductsPage"
import FavoritesPage from "./components/product/FavoritesPage"
import HistoryPage from "./components/product/HistoryPage"
import AboutUs from "./components/aboutus/about"
import AdminLayout from "../admin/AdminLayout";
import AdminAccounts from "../admin/AdminAccounts";
import AdminProducts from "../admin/AdminProducts";
function App() {
  return (
    <Routes>
      <Route element={<LayoutPage />}>
              <Route path="/" element={<WebsiteHome/>} />
              <Route path="/register" element={<RegisterForm/>} />
              <Route path="/login" element={<LoginForm/>} />
              <Route path="/products" element={<ProductsPage/>} />
              <Route path="/favorites" element={<FavoritesPage/>} />
              <Route path="/history" element={<HistoryPage/>} />
              <Route path="/about" element={<AboutUs/>} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="accounts" replace />} />
                    <Route path="accounts" element={<AdminAccounts />} />
                    <Route path="products" element={<AdminProducts />} />
      </Route>
    </Routes>
  );
}

export default App