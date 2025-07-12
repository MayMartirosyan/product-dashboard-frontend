import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import { SignUp } from './pages/SignUp/SignUp';
import { SignIn } from './pages/SignIn/SignIn';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { MyProfile } from './pages/MyProfile/MyProfile';
import { ProductDetails } from './pages/ProductDetails/ProductDetails';
import Header from './components/common/Header/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer autoClose={4000} />
      <Header />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" index element={<Dashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};
