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
    
    // Function to get products of an order by its ID
    const getOrderProducts = (order) => {
        return order.products.map(p => {
            const product = products.find(prod => prod.id === p.productId);
            return product ? `${product.name} (${p.quantity} units.)` : 'Unknown product';
        }).join(', ');
    };

    return (
        <div className="suppliers-table-card">
            <h3>Suppliers List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>RUC</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Actions</th>
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
                                        <button onClick={() => onEdit(supplier)} className="btn btn-secondary btn-sm">Edit</button>
                                        <button onClick={() => onDelete(supplier.id)} className="btn btn-danger btn-sm">Delete</button>
                                        <button onClick={() => onViewHistory(supplier.id)} className="btn btn-info btn-sm">
                                            {selectedSupplierId === supplier.id ? 'Hide History' : 'View History'}
                                        </button>
                                    </td>
                                </tr>
                                {selectedSupplierId === supplier.id && (
                                    <tr className="history-row">
                                        <td colSpan="5">
                                            <h4>Purchase History ({supplier.name})</h4>
                                            {getPurchaseHistory(supplier.id).length > 0 ? (
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Order #</th>
                                                            <th>Date</th>
                                                            <th>Products</th>
                                                            <th>Final Price</th>
                                                            <th>Status</th>
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
                                                <p>No purchase history for this supplier.</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No suppliers available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SuppliersTable;