import React from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio Unitario</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No hay productos para mostrar.</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>${product.unit_price.toFixed(2)}</td>
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