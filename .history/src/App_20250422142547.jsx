// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Home/Home';
import Products from './Home/components/Products';
import Shop from './Shop/Shop';
import AddForm from './Shop/components/AddProductForm';
import Cart from './Shop/components/Cart';
import Auth from './Auth/Auth';
import Fashi from './Home/Fashi';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Fshi />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/add" element={<AddForm />} />
          <Route path="/cart" element={<Cart/>} />
          {/* 404 fallback */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
