import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ show, product, suppliers, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [codeProduct, setCodeProduct] = useState('');
    const [classification, setClassification] = useState('');
    const [stock, setStock] = useState('');
    const [supplierId, setSupplierId] = useState(''); 

    useEffect(() => {
        if (show && product) {
            setName(product.name || '');
            setUnitPrice(product.unit_price || '');
            setCodeProduct(product.code_product || '');
            setClassification(product.classification || '');
            setStock(product.stock || '');
            setSupplierId(product.supplier_id || '');
        } else if (show && !product) {
            setName('');
            setUnitPrice('');
            setCodeProduct('');
            setClassification('');
            setStock('');
            setSupplierId(suppliers.length > 0 ? suppliers[0].id : '');
        }
    }, [show, product, suppliers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert('Product name cannot be empty.');
            return;
        }
        if (isNaN(parseFloat(unitPrice)) || parseFloat(unitPrice) <= 0) {
            alert('Unit price must be a positive number.');
            return;
        }
        if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
            alert('Stock must be a non-negative integer.');
            return;
        }
        if (!codeProduct.trim()) {
            alert('Product code cannot be empty.');
            return;
        }
        if (!classification.trim()) {
            alert('Classification cannot be empty.');
            return;
        }
        if (!supplierId) {
            alert('You must select a supplier.');
            return;
        }

        onSave({ 
            id: product ? product.id : null, 
            name, 
            unit_price: parseFloat(unitPrice), 
            code_product: codeProduct,
            classification,
            stock: parseInt(stock),
            supplier_id: supplierId
        });
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productName">Name:</label>
                        <input
                            type="text"
                            id="productName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="codeProduct">Product Code:</label>
                        <input
                            type="text"
                            id="codeProduct"
                            value={codeProduct}
                            onChange={(e) => setCodeProduct(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="classification">Classification:</label>
                        <input
                            type="text"
                            id="classification"
                            value={classification}
                            onChange={(e) => setClassification(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="unitPrice">Unit Price:</label>
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
                    <div className="form-group">
                        <label htmlFor="supplier">Supplier:</label>
                        <select
                            id="supplier"
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            required
                        >
                            <option value="">-- Select a supplier --</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.company_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-confirm">
                            {product ? 'Save Changes' : 'Add Product'}
                        </button>
                        <button type="button" onClick={onCancel} className="btn-cancel">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;