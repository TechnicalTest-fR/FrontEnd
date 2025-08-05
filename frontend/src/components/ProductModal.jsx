import React, { useState, useEffect } from 'react';
import './ProductModal.css';

// El componente ahora recibe una nueva prop: 'suppliers'
const ProductModal = ({ show, product, suppliers, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [codeProduct, setCodeProduct] = useState('');
    const [classification, setClassification] = useState('');
    const [stock, setStock] = useState('');
    // Nuevo estado para el proveedor seleccionado
    const [supplierId, setSupplierId] = useState(''); 

    useEffect(() => {
        if (show && product) {
            setName(product.name || '');
            setUnitPrice(product.unit_price || '');
            setCodeProduct(product.code_product || '');
            setClassification(product.classification || '');
            setStock(product.stock || '');
            // Si el producto existe, establece el ID del proveedor
            setSupplierId(product.supplier_id || '');
        } else if (show && !product) {
            setName('');
            setUnitPrice('');
            setCodeProduct('');
            setClassification('');
            setStock('');
            // Por defecto, selecciona el primer proveedor si hay
            setSupplierId(suppliers.length > 0 ? suppliers[0].id : '');
        }
    }, [show, product, suppliers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('El nombre del producto no puede estar vacío.');
            return;
        }
        if (isNaN(parseFloat(unitPrice)) || parseFloat(unitPrice) <= 0) {
            alert('El precio unitario debe ser un número positivo.');
            return;
        }
        if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
            alert('El stock debe ser un número entero no negativo.');
            return;
        }
        if (!codeProduct.trim()) {
            alert('El código de producto no puede estar vacío.');
            return;
        }
        if (!classification.trim()) {
            alert('La clasificación no puede estar vacía.');
            return;
        }
        // Nueva validación para el proveedor
        if (!supplierId) {
            alert('Debe seleccionar un proveedor.');
            return;
        }

        onSave({ 
            id: product ? product.id : null, 
            name, 
            unit_price: parseFloat(unitPrice), 
            code_product: codeProduct,
            classification,
            stock: parseInt(stock),
            supplier_id: supplierId // <-- Guardamos el ID del proveedor
        });
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{product ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productName">Nombre:</label>
                        <input
                            type="text"
                            id="productName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    {/* ... (otros campos del formulario) ... */}
                    <div className="form-group">
                        <label htmlFor="codeProduct">Código de Producto:</label>
                        <input
                            type="text"
                            id="codeProduct"
                            value={codeProduct}
                            onChange={(e) => setCodeProduct(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="classification">Clasificación:</label>
                        <input
                            type="text"
                            id="classification"
                            value={classification}
                            onChange={(e) => setClassification(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="unitPrice">Precio Unitario:</label>
                        <input
                            type="number"
                            id="unitPrice"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                            step="0.01"
                            min="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock">Stock:</label>
                        <input
                            type="number"
                            id="stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            min="0"
                            required
                        />
                    </div>
                    {/* Campo de selección para el proveedor */}
                    <div className="form-group">
                        <label htmlFor="supplier">Proveedor:</label>
                        <select
                            id="supplier"
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            required
                        >
                            <option value="">-- Seleccione un proveedor --</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.company_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-confirm">
                            {product ? 'Guardar Cambios' : 'Añadir Producto'}
                        </button>
                        <button type="button" onClick={onCancel} className="btn-cancel">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;