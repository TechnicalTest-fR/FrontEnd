import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ show, product, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');

    useEffect(() => {
        if (show && product) {
            setName(product.name || '');
            setUnitPrice(product.unit_price || '');
        } else if (show && !product) {
            setName('');
            setUnitPrice('');
        }
    }, [show, product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validaciones básicas
        if (!name.trim()) {
            alert('El nombre del producto no puede estar vacío.');
            return;
        }
        if (isNaN(parseFloat(unitPrice)) || parseFloat(unitPrice) <= 0) {
            alert('El precio unitario debe ser un número positivo.');
            return;
        }
        onSave({ id: product ? product.id : null, name, unit_price: parseFloat(unitPrice) });
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