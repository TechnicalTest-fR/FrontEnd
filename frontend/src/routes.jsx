import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyOrders from './pages/MyOrders';
import AddEditOrder from './pages/AddEditOrder';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Dashboard  from '../src/pages/Dashboard';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers';

const AppRoutes = () => {
    return (    
        <Routes>
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/add-order" element={<AddEditOrder />} />
            <Route path="/add-order/:id" element={<AddEditOrder />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} /> 
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/reports" element={<Reports />} /> 
            <Route path="/suppliers" element={<Suppliers />} /> 

            <Route path="/" element={<MyOrders />} />
        </Routes>
    );
};

export default AppRoutes;