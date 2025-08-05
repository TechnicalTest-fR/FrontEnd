import React from 'react';
import '../modules/TableEffects.css'; 

const ProductTable = ({ products, suppliers, onEdit, onDelete }) => {

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
                        <th>Classification</th>
                        <th>Supplier</th>
                        <th>Unit Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No products to display.</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.code_product}</td>
                                <td>{product.name}</td>
                                <td>{product.classification}</td>
                                <td>{getSupplierName(product.supplier_id)}</td>
                                <td>
                                    {product.previous_unit_price && product.previous_unit_price !== product.unit_price && (
                                        <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                                            ${Number(product.previous_unit_price).toFixed(2)}
                                        </span>
                                    )}
                                    <span style={{ fontWeight: 'bold', color: product.previous_unit_price !== product.unit_price ? 'blue' : 'inherit' }}>
                                        ${Number(product.unit_price).toFixed(2)}
                                    </span>
                                </td>
                                <td>{product.stock}</td>
                                <td>
                                    <button onClick={() => onEdit(product.id)} className="btn-action btn-edit">Edit</button>
                                    <button onClick={() => onDelete(product.id)} className="btn-action btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;