import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as ordersService from '../services/ordersService';
import * as productsService from '../services/productsService';
import * as suppliersService from '../services/suppliersService'; 
import * as XLSX from 'xlsx';
import '../style.css'; 
import '../modules/Reports.css';

const Reports = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [salesPeriod, setSalesPeriod] = useState('month');

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [ordersData, productsData, suppliersData] = await Promise.all([
                    ordersService.getOrders(),
                    productsService.getProducts(),
                    suppliersService.getSuppliers(), 
                ]);
                setOrders(ordersData);
                setProducts(productsData);
                setSuppliers(suppliersData);
            } catch (err) {
                console.error("Error loading data for reports:", err);
                setError('Error loading data. Check the API connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const { ordersByStatusData, lowStockProducts, topSellingProducts, productsBySupplierData, salesByDay, salesByPeriod } = useMemo(() => {
        
        const productMap = products.reduce((map, product) => {
            map[product.id] = product;
            return map;
        }, {});

        const supplierMap = suppliers.reduce((map, supplier) => {
            map[supplier.id] = supplier;
            return map;
        }, {});

        const ordersByStatus = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});
        const ordersByStatusData = Object.keys(ordersByStatus).map(status => ({
            Status: status,
            "Number of Orders": ordersByStatus[status],
        }));

        const lowStockProducts = products.filter(product => product.stock <= 5);

        const productSales = {};
        orders.forEach(order => {
            if (order.products && Array.isArray(order.products)) {
                order.products.forEach(item => {
                    const product = productMap[item.productId];
                    if (product) {
                        productSales[product.name] = (productSales[product.name] || 0) + item.quantity;
                    }
                });
            }
        });
        const topSellingProducts = Object.keys(productSales)
            .map(name => ({ "Product Name": name, "Quantity Sold": productSales[name] }))
            .sort((a, b) => b["Quantity Sold"] - a["Quantity Sold"])
            .slice(0, 10);

        const productsBySupplier = products.reduce((acc, product) => {
            const supplier = supplierMap[product.supplier_id];
            const supplierName = supplier ? supplier.company_name : 'No supplier';
            acc[supplierName] = (acc[supplierName] || 0) + 1;
            return acc;
        }, {});
        const productsBySupplierData = Object.keys(productsBySupplier).map(name => ({
            "Supplier": name,
            "Number of Products": productsBySupplier[name],
        }));

        const salesByDay = orders.reduce((acc, order) => {
            const date = new Date(order.order_date);
            const key = date.toISOString().split('T')[0];
            acc[key] = (acc[key] || 0) + parseFloat(order.final_price || 0);
            return acc;
        }, {});
        const salesByDayData = Object.keys(salesByDay).map(key => ({
            Period: key,
            Sales: parseFloat(salesByDay[key].toFixed(2)),
        })).sort((a, b) => new Date(a.Period) - new Date(b.Period));
        
        const salesByPeriodData = () => {
            if (salesPeriod === 'day') return salesByDayData;

            const sales = {};
            salesByDayData.forEach(sale => {
                const date = new Date(sale.Period);
                let key;
                if (salesPeriod === 'week') {
                    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
                    key = startOfWeek.toISOString().split('T')[0];
                } else if (salesPeriod === 'month') {
                    key = date.toISOString().substring(0, 7);
                }
                if (key) {
                    sales[key] = (sales[key] || 0) + sale.Sales;
                }
            });
            return Object.keys(sales).map(key => ({
                Period: key,
                Sales: parseFloat(sales[key].toFixed(2)),
            })).sort((a, b) => new Date(a.Period) - new Date(b.Period));
        };
        
        return {
            ordersByStatusData, 
            lowStockProducts, 
            topSellingProducts, 
            productsBySupplierData,
            salesByDay, 
            salesByPeriod: salesByPeriodData() 
        };
    }, [orders, products, suppliers, salesPeriod]);

    const handleExportToExcel = (data, fileName) => {
        if (!data || data.length === 0) {
            alert("No data to export.");
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading) {
        return <div className="container">Loading data for reports...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container reports-container">
            <h1>Reports Module</h1>

            <div className="report-card">
                <div className="report-header">
                    <h3>Sales by Period</h3>
                    <div className="report-actions">
                        <select onChange={(e) => setSalesPeriod(e.target.value)} value={salesPeriod}>
                            <option value="day">By Day</option>
                            <option value="week">By Week</option>
                            <option value="month">By Month</option>
                        </select>
                        <button 
                            className="btn btn-export" 
                            onClick={() => handleExportToExcel(salesByPeriod, `Sales_${salesPeriod}`)}>
                            Export to Excel
                        </button>
                    </div>
                </div>
                <div className="report-content">
                    <table>
                        <thead>
                            <tr><th>Period</th><th>Total Sales</th></tr>
                        </thead>
                        <tbody>
                            {salesByPeriod.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Period}</td>
                                    <td>${item.Sales.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="report-card">
                <div className="report-header">
                    <h3>Top Selling Products (Top 10)</h3>
                    <button 
                        className="btn btn-export" 
                        onClick={() => handleExportToExcel(topSellingProducts, 'Top_Selling_Products')}>
                        Export to Excel
                    </button>
                </div>
                <div className="report-content">
                    <table>
                        <thead>
                            <tr><th>Product Name</th><th>Quantity Sold</th></tr>
                        </thead>
                        <tbody>
                            {topSellingProducts.map((item, index) => (
                                <tr key={index}>
                                    <td>{item["Product Name"]}</td>
                                    <td>{item["Quantity Sold"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="report-card">
                <div className="report-header">
                    <h3>Orders by Status</h3>
                    <button 
                        className="btn btn-export" 
                        onClick={() => handleExportToExcel(ordersByStatusData, 'Orders_by_Status')}>
                        Export to Excel
                    </button>
                </div>
                <div className="report-content">
                    <table>
                        <thead>
                            <tr><th>Status</th><th>Number of Orders</th></tr>
                        </thead>
                        <tbody>
                            {ordersByStatusData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Status}</td>
                                    <td>{item["Number of Orders"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="report-card">
                <div className="report-header">
                    <h3>Products by Supplier</h3>
                    <button 
                        className="btn btn-export" 
                        onClick={() => handleExportToExcel(productsBySupplierData, 'Products_by_Supplier')}>
                        Export to Excel
                    </button>
                </div>
                <div className="report-content">
                    {productsBySupplierData.length > 0 ? (
                        <table>
                            <thead>
                                <tr><th>Supplier</th><th>Number of Products</th></tr>
                            </thead>
                            <tbody>
                                {productsBySupplierData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Supplier}</td>
                                        <td>{item["Number of Products"]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No supplier data available.</p>
                    )}
                </div>
            </div>

            <div className="report-card">
                <div className="report-header">
                    <h3>Low Inventory (Stock &lt;= 5)</h3>
                    <button 
                        className="btn btn-export" 
                        onClick={() => handleExportToExcel(lowStockProducts, 'Low_Inventory')}>
                        Export to Excel
                    </button>
                </div>
                <div className="report-content">
                    {lowStockProducts.length > 0 ? (
                        <table>
                            <thead>
                                <tr><th>Product Name</th><th>Current Stock</th></tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No products with low stock.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;