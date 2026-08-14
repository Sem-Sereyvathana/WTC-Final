//import { useState } from 'react';
import { Link,Route, Routes } from 'react-router-dom';
import './App.css'
import WebsiteHome from "./components/homepage/home"
import LoginForm from "./components/regandlog/login"
import  RegisterForm  from "./components/regandlog/register"
import LayoutPage from "./components/layout/Layout"

function App() {




return (
    <div>
        <Routes>
                <Route element={<LayoutPage />}>
                        <Route path="/" element={<WebsiteHome/>} />
                        <Route path="/register" element={<RegisterForm/>} />
                        <Route path="/login" element={<LoginForm/>} />
                </Route>
        </Routes>

    </div>
    




);
}

export default App
