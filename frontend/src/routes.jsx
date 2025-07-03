import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyOrders from './pages/MyOrders';
import AddEditOrder from './pages/AddEditOrder';
import Products from './pages/Products';

const AppRoutes = () => {
    return (    
        <Routes>
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/add-order" element={<AddEditOrder />} />
            <Route path="/add-order/:id" element={<AddEditOrder />} />
            <Route path="/products" element={<Products />} />
            <Route path="/" element={<MyOrders />} />
        </Routes>
    );
};

export default AppRoutes;