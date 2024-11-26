import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Links from './components/Links'
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/scroll'
import { CartProvider } from './components/Constants/CartContext'

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Links />
      </Router>
    </CartProvider>
  );
}

export default App
