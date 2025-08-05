// src/components/ProductTable.jsx
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
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Clasificación</th>
                        <th>Proveedor</th>
                        <th>Precio Unitario</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No hay productos para mostrar.</td>
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
                                    <button onClick={() => onEdit(product.id)} className="btn-action btn-edit">Editar</button>
                                    <button onClick={() => onDelete(product.id)} className="btn-action btn-delete">Eliminar</button>
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