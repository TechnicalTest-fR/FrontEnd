import React, { useState, useEffect } from 'react';
import './ProductModal.css'; // Reutilizamos los estilos del modal

const StockEditModal = ({ show, product, onSave, onCancel }) => {
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (show && product) {
            setStock(product.stock || '');
        }
    }, [show, product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newStock = parseInt(stock);
        
        if (isNaN(newStock) || newStock < 0) {
            alert('El stock debe ser un número entero no negativo.');
            return;
        }

        onSave(product.id, newStock);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Stock de {product ? product.name : ''}</h2>
                <form onSubmit={handleSubmit}>
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
                    <div className="modal-actions">
                        <button type="submit" className="btn-confirm">
                            Guardar
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

export default StockEditModal;