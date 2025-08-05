import React from 'react';
import '../modules/TableEffects.css'; 

const InventoryTable = ({ products, suppliers, onEditStock }) => {
    
    const getSupplierName = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.company_name : 'N/A';
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Supplier</th>
                        <th>Stock Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>There are no products in inventory..</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.code_product}</td> 
                                <td>{product.name}</td>
                                <td>${Number(product.unit_price).toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td>{getSupplierName(product.supplier_id)}</td> 
                                <td>
                                    <span className={`stock-status ${product.stock <= 5 ? 'low' : 'available'}`}>
                                        {product.stock <= 5 ? 'Bajo' : 'Disponible'}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => onEditStock(product.id)} className="btn-action btn-edit">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;