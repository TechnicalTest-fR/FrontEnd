// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import * as productsService from '../services/productsService';
import * as suppliersService from '../services/suppliersService'; 
import ProductTable from '../components/ProductTable';
import ProductModal from '../components/ProductModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Pagination from '../components/Pagination';
import Product from '../models/Product';
import '../style.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showProductModal, setShowProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    // Estados para los filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [classificationFilter, setClassificationFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [productsData, suppliersData] = await Promise.all([
                productsService.getProducts(),
                suppliersService.getSuppliers()
            ]);
            
            const productsAsObjects = productsData.map(productData => new Product(productData));
            setProducts(productsAsObjects);
            setSuppliers(suppliersData);
            
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Error al cargar los datos. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers de los filtros
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reiniciar paginación
    };

    const handleClassificationChange = (e) => {
        setClassificationFilter(e.target.value);
        setCurrentPage(1); // Reiniciar paginación
    };

    const handleSupplierChange = (e) => {
        setSupplierFilter(e.target.value);
        setCurrentPage(1); // Reiniciar paginación
    };

    // Lógica para aplicar los filtros
    const filteredProducts = products.filter(product => {
        const matchesSearchTerm = 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code_product.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesClassification = classificationFilter === '' || product.classification === classificationFilter;
        
        const matchesSupplier = supplierFilter === '' || product.supplier_id.toString() === supplierFilter;

        return matchesSearchTerm && matchesClassification && matchesSupplier;
    });

    const handleAddProduct = () => {
        setCurrentProduct(null);
        setShowProductModal(true);
    };

    const handleEditProduct = (id) => {
        const productToEdit = products.find(p => p.id === id);
        setCurrentProduct(productToEdit);
        setShowProductModal(true);
    };

    const handleSaveProduct = async (productData) => {
        setShowProductModal(false);
        try {
            if (productData.id) {
                const productToUpdate = products.find(p => p.id === productData.id);
                if (!productToUpdate) {
                    throw new Error('Producto no encontrado en el estado.');
                }
                
                const updatedProduct = new Product({...productToUpdate, supplier_id: productData.supplier_id});
                
                if (updatedProduct.unit_price !== productData.unit_price) {
                    updatedProduct.updatePrice(productData.unit_price);
                }
                
                updatedProduct.name = productData.name;
                updatedProduct.code_product = productData.code_product;
                updatedProduct.classification = productData.classification;
                updatedProduct.stock = productData.stock;

                await productsService.updateProduct(updatedProduct.id, updatedProduct);
                alert('Producto actualizado con éxito!');

            } else {
                await productsService.createProduct(productData);
                alert('Producto añadido con éxito!');
            }
            fetchData();
            setCurrentPage(1);
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
                alert('Producto eliminado con éxito!');
                fetchData();
                setCurrentPage(1);
            } catch (err) {
                console.error('Failed to delete product:', err);
                alert('Error al eliminar el producto.');
            } finally {
                setProductIdToDelete(null);
            }
        }
    };

    const handleCancelConfirmModal = () => {
        setShowConfirmModal(false);
        setProductIdToDelete(null);
    };

    // Lógica de paginación sobre los productos filtrados
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Obtener clasificaciones únicas para el filtro
    const uniqueClassifications = [...new Set(products.map(p => p.classification))];

    if (loading) {
        return <div className="container">Cargando productos y proveedores...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Products</h1>
            
            <div className="table-actions">
                <button onClick={handleAddProduct} className="btn-primary">
                    New Product
                </button>
                <div className="filters-container">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select
                        value={classificationFilter}
                        onChange={handleClassificationChange}
                        className="filter-select"
                    >
                        <option value="">Todas las Clasificaciones</option>
                        {uniqueClassifications.map(classification => (
                            <option key={classification} value={classification}>
                                {classification}
                            </option>
                        ))}
                    </select>
                    <select
                        value={supplierFilter}
                        onChange={handleSupplierChange}
                        className="filter-select"
                    >
                        <option value="">Todos los Proveedores</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.company_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <ProductTable
                products={currentProducts}
                suppliers={suppliers}
                onEdit={handleEditProduct}
                onDelete={handleDeleteClick}
            />

            {filteredProducts.length === 0 && (
                <div className="no-results">No se encontraron productos que coincidan con los filtros.</div>
            )}

            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredProducts.length}
                currentPage={currentPage}
                paginate={paginate}
            />

            <ProductModal
                show={showProductModal}
                product={currentProduct}
                suppliers={suppliers}
                onSave={handleSaveProduct}
                onCancel={handleCancelProductModal}
            />

            <ConfirmationModal
                show={showConfirmModal}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que quieres eliminar este producto?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelConfirmModal}
            />
        </div>
    );
};

export default Products;