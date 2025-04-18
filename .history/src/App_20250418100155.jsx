// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Home/Home';
import Products from './Home/components/Products';
import Shop from './Shop/Shop';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/add" element={<Shop />} />
          {/* 404 fallback */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
