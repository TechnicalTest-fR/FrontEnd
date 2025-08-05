import React from 'react';
import '../modules/TableEffects.css'; 

// El componente ahora acepta una nueva prop `suppliers`
const InventoryTable = ({ products, suppliers, onEditStock }) => {
    
    // Función de ayuda para encontrar el nombre del proveedor
    const getSupplierName = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.company_name : 'N/A';
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {/* Nueva columna para el Código de Producto */}
                        <th>Código</th> 
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Proveedor</th> 
                        <th>Estado del stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            {/* La celda ahora abarca 7 columnas */}
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No hay productos en inventario.</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id}>
                                {/* Mostramos el código del producto */}
                                <td>{product.code_product}</td> 
                                <td>{product.name}</td>
                                <td>${Number(product.unit_price).toFixed(2)}</td>
                                <td>{product.stock}</td>
                                {/* Mostramos el nombre del proveedor usando la función de ayuda */}
                                <td>{getSupplierName(product.supplier_id)}</td> 
                                <td>
                                    <span className={`stock-status ${product.stock <= 5 ? 'low' : 'available'}`}>
                                        {product.stock <= 5 ? 'Bajo' : 'Disponible'}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => onEditStock(product.id)} className="btn-action btn-edit">
                                        Editar
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