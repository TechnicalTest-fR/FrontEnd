import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AppRoutes from './routes';
import './style.css';

function App() {
    return (
        <Router>
            <nav style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', display: 'flex', gap: '20px' }}>
                <Link to="/my-orders" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>My Orders</Link>
                <Link to="/products" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Product Management</Link>
            </nav>
            <div className="App">
                <AppRoutes />
            </div>
        </Router>
    );
}

export default App;