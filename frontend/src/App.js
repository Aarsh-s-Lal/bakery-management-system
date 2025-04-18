import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import OrderStatus from './components/OrderStatus';

function App() {
  return (
    <Router>
      <div className="container py-4">
        <header className="pb-3 mb-4 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/" className="text-decoration-none">
              <h1 className="fs-4">Sweet Delights Bakery</h1>
            </Link>
            <nav>
              <ul className="nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link">Products</Link>
                </li>
                <li className="nav-item">
                  <Link to="/order" className="nav-link">Place Order</Link>
                </li>
                <li className="nav-item">
                  <Link to="/status" className="nav-link">Check Status</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/status" element={<OrderStatus />} />
          </Routes>
        </main>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2025 Sweet Delights Bakery
        </footer>
      </div>
    </Router>
  );
}

export default App;