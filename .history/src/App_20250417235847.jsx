// src/App.js
import React from 'react';
import Home from './Home/Home';
import './App.css'; // You might have some default styles here
import Products from './Home/Products';

function App() {
  return (
    <div className="App">
      <Home />
      <div className="spacer">
        <h2>Scroll Down to See the Effect</h2>
        <p>This is some extra content to enable scrolling.</p>
      </div>
      <Products />
    </div>
  );
}

export default App;