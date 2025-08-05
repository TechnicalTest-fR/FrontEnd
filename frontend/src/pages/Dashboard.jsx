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
    // Añadimos un estado para manejar los errores de la API
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null); // Reseteamos el error al iniciar la carga
            try {
                const [ordersData, productsData] = await Promise.all([
                    ordersService.getOrders(),
                    productsService.getProducts()
                ]);
                setOrders(ordersData);
                setProducts(productsData);
            } catch (err) {
                console.error("Error al cargar datos del dashboard:", err);
                // Establecemos el mensaje de error para mostrar en la UI
                setError('Error al cargar los datos del dashboard. Verifique la conexión con la API.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const { stats, chartData, lowStockProducts } = useMemo(() => {
        // Calculamos los productos con stock bajo solo una vez
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
            const classification = product.classification || 'Sin clasificación';
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
    }, [orders, products]); // Se recalcula si cambian las órdenes o los productos

    if (loading) {
        return <div className="container">Cargando datos del dashboard...</div>;
    }

    // Mostramos el mensaje de error si existe
    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A0'];

    return (
        <div className="container dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Tarjetas de KPIs */}
            <div className="stats-cards">
                <div className="card">
                    <h3>Órdenes Totales</h3>
                    <p className="stat-number">{stats.totalOrders}</p>
                </div>
                <div className="card">
                    <h3>Ingresos Totales</h3>
                    <p className="stat-number">${stats.totalRevenue}</p>
                </div>
                <div className="card">
                    <h3>Productos en Stock</h3>
                    <p className="stat-number">{stats.totalStock}</p>
                </div>
                <div className="card low-stock-card">
                    <h3>Stock Bajo</h3>
                    <p className="stat-number">{stats.lowStockItems}</p>
                </div>
            </div>

            {/* Sección de gráficos */}
            <div className="charts-section">
                <div className="card chart-card">
                    <h3>Total de Productos por Clasificación</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.classificationChartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Nº de Productos" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <h3>Nivel de Stock</h3>
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
                {/* Tabla de órdenes recientes */}
                <div className="card recent-orders">
                    <h3>Órdenes Recientes</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Nº Pedido</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Precio Final</th>
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
                    <button onClick={() => navigate('/orders')} className="btn btn-primary btn-sm">Ver todos los pedidos</button>
                </div>

                {/* Alerta de inventario */}
                <div className="card low-stock-alert">
                    <h3>Productos con Stock Bajo</h3>
                    {lowStockProducts.length > 0 ? (
                        <ul>
                            {lowStockProducts.map(product => (
                                <li key={product.id}>{product.name} (Stock: {product.stock})</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay productos con stock bajo.</p>
                    )}
                    <button onClick={() => navigate('/inventory')} className="btn btn-primary btn-sm">Gestionar inventario</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;