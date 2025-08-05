import React from 'react';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import AppRoutes from './routes';
import './modules/Slide.css';

import { FaBoxes, FaClipboardList, FaUsers, FaChartBar, FaFileAlt, FaDollyFlatbed } from 'react-icons/fa';

function App() {
    return (
        <Router>
            <div className="main-container">
                <nav className="sidebar">
                    <div className="logo-container">
                        <img src="src/assets/images/logo.png" alt="OrderFlowSolutions Logo" className="logo" />
                    </div>
                    <ul className="sidebar-links">
                        <li>
                            <NavLink to="/dashboard">
                                <FaChartBar className="icon" /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/my-orders"> 
                                <FaClipboardList className="icon" /> My Orders
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/products">
                                <FaBoxes className="icon" /> Product Management
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/suppliers">
                                <FaUsers className="icon" /> Suppliers
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/inventory">
                                <FaDollyFlatbed className="icon" /> Inventory
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reports">
                                <FaFileAlt className="icon" /> Reports
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                {/* <div className="content">*/}
                    <div className="card">
                        <AppRoutes />
                    </div>
                {/*</div>*/}
            </div>
        </Router>
    );
}

export default App;