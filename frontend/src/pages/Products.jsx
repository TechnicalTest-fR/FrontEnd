import React, { useState, useEffect } from 'react';
import * as productsService from '../services/productsService'; 
import ProductTable from '../components/ProductTable';
import ProductModal from '../components/ProductModal';
import ConfirmationModal from '../components/ConfirmationModal';
import '../style.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showProductModal, setShowProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productsService.getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Error al cargar los productos. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        setCurrentProduct(null);
        setShowProductModal(true);
    };

    const handleEditProduct = async (id) => {
        try {
            const productToEdit = await productsService.getProductById(id);
            setCurrentProduct(productToEdit)
            setShowProductModal(true);
        } catch (err) {
            console.error(`Failed to fetch product ${id} for editing:`, err);
            alert('Error al cargar el producto para editar.');
        }
    };

    const handleSaveProduct = async (productData) => {
        setShowProductModal(false);
        try {
            if (productData.id) {
                await productsService.updateProduct(productData.id, productData);
                alert('Producto actualizado con éxito!');
            } else {
                await productsService.createProduct(productData);
                alert('Producto añadido con éxito!');
            }
            fetchProducts();
        } catch (err) {
            console.error('Failed to save product:', err);
            alert('Error al guardar el producto.');
        } finally {
            setCurrentProduct(null);
        }
    };

    const handleCancelProductModal = () => {
        setShowProductModal(false);
        setCurrentProduct(null);
    };

    const handleDeleteClick = (id) => {
        setProductIdToDelete(id);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmModal(false);
        if (productIdToDelete) {
            try {
                await productsService.deleteProduct(productIdToDelete);
                alert('Product successfully removed!');
                fetchProducts();
            } catch (err) {
                console.error('Failed to delete product:', err);
                alert('Failed to delete product');
            } finally {
                setProductIdToDelete(null);
            }
        }
    };


    const handleCancelConfirmModal = () => {
        setShowConfirmModal(false);
        setProductIdToDelete(null);
    };

    if (loading) {
        return <div className="container">Cargando productos...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Products</h1>

            <button onClick={handleAddProduct} className="btn-primary" style={{ marginBottom: '20px' }}>
                New Product
            </button>

            <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteClick}
            />

            <ProductModal
                show={showProductModal}
                product={currentProduct}
                onSave={handleSaveProduct}
                onCancel={handleCancelProductModal}
            />

            <ConfirmationModal
                show={showConfirmModal}
                title="Confirm Deletion"
                message="¿Are you sure you want to delete this product?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelConfirmModal}
            />
        </div>
    );
};

export default Products;