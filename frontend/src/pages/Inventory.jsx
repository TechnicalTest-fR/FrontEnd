// src/pages/Inventory.jsx
import React, { useState, useEffect } from 'react';
import * as productsService from '../services/productsService';
import * as suppliersService from '../services/suppliersService'; 
import Product from '../models/Product';
import InventoryTable from '../components/InventoryTable';
import StockEditModal from '../components/StockEditModal'; 
import Pagination from '../components/Pagination';
import '../style.css';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showStockModal, setShowStockModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Estados para los filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [stockStatusFilter, setStockStatusFilter] = useState('');

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    const fetchAllData = async () => {
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
            setError('Error al cargar el inventario. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Handlers para los cambios en los filtros
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetear la paginación al cambiar el filtro
    };

    const handleSupplierChange = (e) => {
        setSupplierFilter(e.target.value);
        setCurrentPage(1); // Resetear la paginación
    };

    const handleStockStatusChange = (e) => {
        setStockStatusFilter(e.target.value);
        setCurrentPage(1); // Resetear la paginación
    };

    // Lógica para aplicar todos los filtros combinados
    const filteredProducts = products.filter(product => {
        const matchesSearchTerm = 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code_product.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSupplier = supplierFilter === '' || product.supplier_id.toString() === supplierFilter;

        const matchesStockStatus = stockStatusFilter === '' || 
            (stockStatusFilter === 'low' && product.stock <= 5) ||
            (stockStatusFilter === 'available' && product.stock > 5);
        
        return matchesSearchTerm && matchesSupplier && matchesStockStatus;
    });

    const handleEditStockClick = (id) => {
        const productToEdit = products.find(p => p.id === id);
        setCurrentProduct(productToEdit);
        setShowStockModal(true);
    };

    const handleSaveStock = async (productId, newStock) => {
        setShowStockModal(false);
        try {
            const productToUpdate = products.find(p => p.id === productId);
            if (!productToUpdate) {
                throw new Error('Producto no encontrado.');
            }
            
            const updatedProduct = { ...productToUpdate, stock: newStock };

            await productsService.updateProduct(updatedProduct.id, updatedProduct);
            alert('Stock actualizado con éxito!');
            
            fetchAllData(); 
            
        } catch (err) {
            console.error('Failed to save stock:', err);
            alert('Error al guardar el stock.');
        } finally {
            setCurrentProduct(null);
        }
    };
    
    const handleCancelStockModal = () => {
        setShowStockModal(false);
        setCurrentProduct(null);
    };

    // Lógica de paginación sobre los productos filtrados
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className="container">Cargando inventario...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Inventario</h1>
            <div className="table-actions">
                <div className="filters-container">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={supplierFilter} onChange={handleSupplierChange} className="filter-select">
                        <option value="">Filtrar por Proveedor</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.company_name}
                            </option>
                        ))}
                    </select>
                    <select value={stockStatusFilter} onChange={handleStockStatusChange} className="filter-select">
                        <option value="">Estado de Stock</option>
                        <option value="available">Disponible</option>
                        <option value="low">Bajo</option>
                    </select>
                </div>
            </div>
            
            <InventoryTable
                products={currentProducts}
                suppliers={suppliers}
                onEditStock={handleEditStockClick}
            />

            {filteredProducts.length === 0 && (
                <div className="no-results">No se encontraron productos que coincidan con los filtros.</div>
            )}
            
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredProducts.length} // El total de elementos ahora es el de los productos filtrados
                currentPage={currentPage}
                paginate={paginate}
            />

            <StockEditModal
                show={showStockModal}
                product={currentProduct}
                onSave={handleSaveStock}
                onCancel={handleCancelStockModal}
            />
        </div>
    );
};

export default Inventory;