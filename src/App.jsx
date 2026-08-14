//import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css'
import WebsiteHome from "./components/homepage/home"
import LoginForm from "./components/regandlog/login"
import RegisterForm from "./components/regandlog/register"
import LayoutPage from "./components/layout/Layout"

function App() {
  return (
    <Routes>
      <Route element={<LayoutPage />}>
        <Route path="/" element={<WebsiteHome/>} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/login" element={<LoginForm/>} />
      </Route>
    </Routes>
  );
}

export default App
