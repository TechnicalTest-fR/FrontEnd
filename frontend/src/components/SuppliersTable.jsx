// src/components/SuppliersTable.jsx
import React from 'react';

const SuppliersTable = ({ 
    suppliers, 
    orders, 
    products, 
    onEdit, 
    onDelete, 
    onViewHistory, 
    selectedSupplierId, 
    getPurchaseHistory 
}) => {
    
    // Función para obtener los productos de una orden por su ID
    const getOrderProducts = (order) => {
        return order.products.map(p => {
            const product = products.find(prod => prod.id === p.productId);
            return product ? `${product.name} (${p.quantity} unid.)` : 'Producto desconocido';
        }).join(', ');
    };

    return (
        <div className="suppliers-table-card">
            <h3>Lista de Proveedores</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>RUC</th>
                        <th>Contacto</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.length > 0 ? (
                        suppliers.map(supplier => (
                            <React.Fragment key={supplier.id}>
                                <tr>
                                    <td>{supplier.company_name}</td>
                                    <td>{supplier.ruc}</td>
                                    <td>{supplier.contact}</td>
                                    <td>{supplier.address}</td>
                                    <td className="actions-cell">
                                        <button onClick={() => onEdit(supplier)} className="btn btn-secondary btn-sm">Editar</button>
                                        <button onClick={() => onDelete(supplier.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                        <button onClick={() => onViewHistory(supplier.id)} className="btn btn-info btn-sm">
                                            {selectedSupplierId === supplier.id ? 'Ocultar Historial' : 'Ver Historial'}
                                        </button>
                                    </td>
                                </tr>
                                {selectedSupplierId === supplier.id && (
                                    <tr className="history-row">
                                        <td colSpan="5">
                                            <h4>Historial de Compras ({supplier.name})</h4>
                                            {getPurchaseHistory(supplier.id).length > 0 ? (
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Nº Pedido</th>
                                                            <th>Fecha</th>
                                                            <th>Productos</th>
                                                            <th>Precio Final</th>
                                                            <th>Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getPurchaseHistory(supplier.id).map(order => (
                                                            <tr key={order.id}>
                                                                <td>{order.order_number}</td>
                                                                <td>{order.order_date}</td>
                                                                <td>{getOrderProducts(order)}</td>
                                                                <td>${Number(order.final_price).toFixed(2)}</td>
                                                                <td>{order.status}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>No hay historial de compras para este proveedor.</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay proveedores disponibles.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SuppliersTable;