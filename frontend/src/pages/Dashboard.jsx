import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as ordersService from '../services/ordersService';
import * as productsService from '../services/productsService';
import '../style.css'; 
import '../modules/Dashboard.css';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [ordersData, productsData] = await Promise.all([
                    ordersService.getOrders(),
                    productsService.getProducts()
                ]);
                setOrders(ordersData);
                setProducts(productsData);
            } catch (err) {
                console.error("Error loading dashboard data:", err);
                setError('Error loading dashboard data. Check the API connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const { stats, chartData, lowStockProducts } = useMemo(() => {
        const lowStockProducts = products.filter(p => p.stock <= 5);

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.final_price || 0), 0);
        const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
        
        const stats = {
            totalOrders,
            totalRevenue: totalRevenue.toFixed(2),
            totalStock,
            lowStockItems: lowStockProducts.length,
        };

        const productCountByClassification = products.reduce((acc, product) => {
            const classification = product.classification || 'Unclassified';
            acc[classification] = (acc[classification] || 0) + 1;
            return acc;
        }, {});
        
        const classificationChartData = Object.keys(productCountByClassification).map(key => ({
            name: key,
            count: productCountByClassification[key]
        }));

        const productStockData = products.map(p => ({
            name: p.name,
            stock: p.stock
        }));

        const chartData = {
            classificationChartData,
            productStockData,
        };
        
        return { stats, chartData, lowStockProducts };
    }, [orders, products]);

    if (loading) {
        return <div className="container">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A0'];

    return (
        <div className="container dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            <div className="stats-cards">
                <div className="card">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{stats.totalOrders}</p>
                </div>
                <div className="card">
                    <h3>Total Revenue</h3>
                    <p className="stat-number">${stats.totalRevenue}</p>
                </div>
                <div className="card">
                    <h3>Products in Stock</h3>
                    <p className="stat-number">{stats.totalStock}</p>
                </div>
                <div className="card low-stock-card">
                    <h3>Low Stock</h3>
                    <p className="stat-number">{stats.lowStockItems}</p>
                </div>
            </div>

            <div className="charts-section">
                <div className="card chart-card">
                    <h3>Total Products by Classification</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.classificationChartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="# of Products" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <h3>Stock Level</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData.productStockData}
                                dataKey="stock"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#82ca9d"
                                label
                            >
                                {chartData.productStockData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="card recent-orders">
                    <h3>Recent Orders</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Final Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id}>
                                    <td>{order.order_number}</td>
                                    <td>{order.customer_name}</td>
                                    <td>{order.status}</td>
                                    <td>${Number(order.final_price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => navigate('/orders')} className="btn btn-primary btn-sm">View all orders</button>
                </div>

                <div className="card low-stock-alert">
                    <h3>Products with Low Stock</h3>
                    {lowStockProducts.length > 0 ? (
                        <ul>
                            {lowStockProducts.map(product => (
                                <li key={product.id}>{product.name} (Stock: {product.stock})</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No products with low stock.</p>
                    )}
                    <button onClick={() => navigate('/inventory')} className="btn btn-primary btn-sm">Manage inventory</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;