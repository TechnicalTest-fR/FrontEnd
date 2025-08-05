// src/pages/Reports.jsx
import React, { useState, useEffect, useMemo } from 'react';
import * as ordersService from '../services/ordersService';
import * as productsService from '../services/productsService';
// Importamos el nuevo servicio para los proveedores
import * as suppliersService from '../services/suppliersService'; 
import * as XLSX from 'xlsx';
import '../style.css'; 
import '../modules/Reports.css';

const Reports = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    // Nuevo estado para los proveedores
    const [suppliers, setSuppliers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Estado para manejar errores
    const [salesPeriod, setSalesPeriod] = useState('month');

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null); // Reseteamos el error al iniciar la carga
            try {
                // Usamos Promise.all para hacer las 3 peticiones al mismo tiempo
                const [ordersData, productsData, suppliersData] = await Promise.all([
                    ordersService.getOrders(),
                    productsService.getProducts(),
                    suppliersService.getSuppliers(), 
                ]);
                setOrders(ordersData);
                setProducts(productsData);
                setSuppliers(suppliersData); // Guardamos la lista de proveedores
            } catch (err) {
                console.error("Error al cargar los datos para los reportes:", err);
                setError('Error al cargar los datos. Verifique la conexión con la API.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // OPTIMIZACIÓN: Se usa un solo useMemo para todos los cálculos complejos.
    const { ordersByStatusData, lowStockProducts, topSellingProducts, productsBySupplierData, salesByDay, salesByPeriod } = useMemo(() => {
        
        // Creamos mapas para una búsqueda más eficiente
        const productMap = products.reduce((map, product) => {
            map[product.id] = product;
            return map;
        }, {});

        const supplierMap = suppliers.reduce((map, supplier) => {
            map[supplier.id] = supplier;
            return map;
        }, {});

        // Reporte 1: Órdenes por estado
        const ordersByStatus = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});
        const ordersByStatusData = Object.keys(ordersByStatus).map(status => ({
            Estado: status,
            "Número de Órdenes": ordersByStatus[status],
        }));

        // Reporte 2: Productos con stock bajo
        const lowStockProducts = products.filter(product => product.stock <= 5);

        // Reporte 3: Productos más vendidos
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
            .map(name => ({ "Nombre del Producto": name, "Cantidad Vendida": productSales[name] }))
            .sort((a, b) => b["Cantidad Vendida"] - a["Cantidad Vendida"])
            .slice(0, 10);

        // Reporte 4: Productos por proveedor (NUEVO)
        const productsBySupplier = products.reduce((acc, product) => {
            const supplier = supplierMap[product.supplier_id];
            const supplierName = supplier ? supplier.company_name : 'Sin proveedor';
            acc[supplierName] = (acc[supplierName] || 0) + 1;
            return acc;
        }, {});
        const productsBySupplierData = Object.keys(productsBySupplier).map(name => ({
            "Proveedor": name,
            "Número de Productos": productsBySupplier[name],
        }));

        // Reporte 5: Ventas por período
        const salesByDay = orders.reduce((acc, order) => {
            const date = new Date(order.order_date);
            const key = date.toISOString().split('T')[0];
            acc[key] = (acc[key] || 0) + parseFloat(order.final_price || 0);
            return acc;
        }, {});
        const salesByDayData = Object.keys(salesByDay).map(key => ({
            Periodo: key,
            Ventas: parseFloat(salesByDay[key].toFixed(2)),
        })).sort((a, b) => new Date(a.Periodo) - new Date(b.Periodo));
        
        const salesByPeriodData = () => {
            if (salesPeriod === 'day') return salesByDayData;

            const sales = {};
            salesByDayData.forEach(sale => {
                const date = new Date(sale.Periodo);
                let key;
                if (salesPeriod === 'week') {
                    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
                    key = startOfWeek.toISOString().split('T')[0];
                } else if (salesPeriod === 'month') {
                    key = date.toISOString().substring(0, 7);
                }
                if (key) {
                    sales[key] = (sales[key] || 0) + sale.Ventas;
                }
            });
            return Object.keys(sales).map(key => ({
                Periodo: key,
                Ventas: parseFloat(sales[key].toFixed(2)),
            })).sort((a, b) => new Date(a.Periodo) - new Date(b.Periodo));
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
            alert("No hay datos para exportar.");
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
        XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading) {
        return <div className="container">Cargando datos para los reportes...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container reports-container">
            <h1>Módulo de Reportes</h1>

            {/* Reporte: Ventas por Período */}
            <div className="report-card">
                <div className="report-header">
                    <h3>Ventas por Período</h3>
                    <div className="report-actions">
                        <select onChange={(e) => setSalesPeriod(e.target.value)} value={salesPeriod}>
                            <option value="day">Por Día</option>
                            <option value="week">Por Semana</option>
                            <option value="month">Por Mes</option>
                        </select>
                        <button 
                            className="btn btn-export" 
                            onClick={() => handleExportToExcel(salesByPeriod, `Ventas_${salesPeriod}`)}>
                            Exportar a Excel
                        </button>
                    </div>
                </div>
                <div className="report-content">
                    <table>
                        <thead>
                            <tr><th>Periodo</th><th>Ventas Totales</th></tr>
                        </thead>
                        <tbody>
                            {salesByPeriod.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Periodo}</td>
                                    <td>${item.Ventas.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reporte: Productos Más Vendidos (Top 10) */}
            <div className="report-card">
                <div className="report-header">
                    <h3>Productos Más Vendidos (Top 10)</h3>
                    <button 
                        className="btn btn-export" 
                        onClick={() => handleExportToExcel(topSellingProducts, 'Productos_Mas_Vendidos')}>
                        Exportar a Excel
                    </button>
                </div>
                <div className="report-content">
                    <table>
                        <thead>
                            <tr><th>Producto</th><th>Cantidad Vendida</th></tr>
                        </thead>
                        <tbody>
                            {topSellingProducts.map((item, index) => (
                                <tr key={index}>
                                    <td>{item["Nombre del Producto"]}</td>
                                    <td>{item["Cantidad Vendida"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reporte: Órdenes por Estado */}
            <div className="report-card">
                <div className="report-header">
                    <h3>Órdenes por Estado</h3>
                    <button 
                        className="btn btn-export" 
                        onClick={() => handleExportToExcel(ordersByStatusData, 'Ordenes_por_Estado')}>
                        Exportar a Excel
                    </button>
                </div>
                <div className="report-content">
                    <table>
                        <thead>
                            <tr><th>Estado</th><th>Número de Órdenes</th></tr>
                        </thead>
                        <tbody>
                            {ordersByStatusData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Estado}</td>
                                    <td>{item["Número de Órdenes"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* NUEVO Reporte: Productos por Proveedor */}
            <div className="report-card">
                <div className="report-header">
                    <h3>Productos por Proveedor</h3>
                    <button 
                        className="btn btn-export" 
                        onClick={() => handleExportToExcel(productsBySupplierData, 'Productos_por_Proveedor')}>
                        Exportar a Excel
                    </button>
                </div>
                <div className="report-content">
                    {productsBySupplierData.length > 0 ? (
                        <table>
                            <thead>
                                <tr><th>Proveedor</th><th>Número de Productos</th></tr>
                            </thead>
                            <tbody>
                                {productsBySupplierData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Proveedor}</td>
                                        <td>{item["Número de Productos"]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay datos de proveedores disponibles.</p>
                    )}
                </div>
            </div>

            {/* Reporte: Inventario Bajo */}
            <div className="report-card">
                <div className="report-header">
                    <h3>Inventario Bajo (Stock &lt;= 5)</h3>
                    <button 
                        className="btn btn-export" 
                        onClick={() => handleExportToExcel(lowStockProducts, 'Inventario_Bajo')}>
                        Exportar a Excel
                    </button>
                </div>
                <div className="report-content">
                    {lowStockProducts.length > 0 ? (
                        <table>
                            <thead>
                                <tr><th>Nombre del Producto</th><th>Stock Actual</th></tr>
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
                        <p>No hay productos con stock bajo.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;