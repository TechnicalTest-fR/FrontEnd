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

    const [searchTerm, setSearchTerm] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [stockStatusFilter, setStockStatusFilter] = useState('');

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
            setError('Error loading inventory. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSupplierChange = (e) => {
        setSupplierFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleStockStatusChange = (e) => {
        setStockStatusFilter(e.target.value);
        setCurrentPage(1);
    };

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
                throw new Error('Product not found.');
            }
            
            const updatedProduct = { ...productToUpdate, stock: newStock };

            await productsService.updateProduct(updatedProduct.id, updatedProduct);
            alert('Stock updated successfully!');
            
            fetchAllData(); 
            
        } catch (err) {
            console.error('Failed to save stock:', err);
            alert('Error saving stock.');
        } finally {
            setCurrentProduct(null);
        }
    };
    
    const handleCancelStockModal = () => {
        setShowStockModal(false);
        setCurrentProduct(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className="container">Loading inventory...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Inventory</h1>
            <div className="table-actions">
                <div className="filters-container">
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={supplierFilter} onChange={handleSupplierChange} className="filter-select">
                        <option value="">Filter by Supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.company_name}
                            </option>
                        ))}
                    </select>
                    <select value={stockStatusFilter} onChange={handleStockStatusChange} className="filter-select">
                        <option value="">Stock Status</option>
                        <option value="available">Available</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>
            
            <InventoryTable
                products={currentProducts}
                suppliers={suppliers}
                onEditStock={handleEditStockClick}
            />

            {filteredProducts.length === 0 && (
                <div className="no-results">No products were found that match the filters.</div>
            )}
            
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredProducts.length}
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