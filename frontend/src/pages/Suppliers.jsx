// src/pages/Suppliers.jsx
import React, { useState, useEffect } from 'react';
import * as suppliersService from '../services/suppliersService';
import * as ordersService from '../services/ordersService';
import * as productsService from '../services/productsService';
import SuppliersTable from '../components/SuppliersTable';
import Pagination from '../components/Pagination'; // Asegúrate de tener este componente
import '../style.css';
import '../modules/Suppliers.css';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ id: null, name: '', ruc: '', contact: '', address: '' });
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);

    // Estados para los filtros y la paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Cantidad de proveedores por página

    useEffect(() => {
        const fetchSuppliersAndOrders = async () => {
            setLoading(true);
            try {
                const [suppliersData, ordersData, productsData] = await Promise.all([
                    suppliersService.getSuppliers(),
                    ordersService.getOrders(),
                    productsService.getProducts()
                ]);

                setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
                setOrders(Array.isArray(ordersData) ? ordersData : []);
                setProducts(Array.isArray(productsData) ? productsData : []);

            } catch (error) {
                console.error("Error al cargar datos:", error);
                setSuppliers([]);
                setOrders([]);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSuppliersAndOrders();
    }, []);

    // Handlers para los filtros
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reiniciar la paginación al filtrar
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const supplierData = { ...form, company_name: form.name }; // Usar company_name en lugar de name para la API
            if (form.id) {
                await suppliersService.updateSupplier(form.id, supplierData);
            } else {
                await suppliersService.addSupplier(supplierData);
            }
            setForm({ id: null, name: '', ruc: '', contact: '', address: '' });
            const updatedSuppliers = await suppliersService.getSuppliers();
            setSuppliers(Array.isArray(updatedSuppliers) ? updatedSuppliers : []);
        } catch (error) {
            console.error("Error al guardar proveedor:", error);
        }
    };

    const handleEdit = (supplier) => {
        setForm({ ...supplier, name: supplier.company_name });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
            try {
                await suppliersService.deleteSupplier(id);
                const updatedSuppliers = await suppliersService.getSuppliers();
                setSuppliers(Array.isArray(updatedSuppliers) ? updatedSuppliers : []);
            } catch (error) {
                console.error("Error al eliminar proveedor:", error);
            }
        }
    };

    const handleViewHistory = (supplierId) => {
        setSelectedSupplierId(selectedSupplierId === supplierId ? null : supplierId);
    };

    const getPurchaseHistory = (supplierId) => {
        if (!orders || !products) return [];

        const supplierProductIds = products
            .filter(p => p.supplier_id === supplierId)
            .map(p => p.id);

        const supplierOrders = orders.filter(order =>
            order.products && order.products.some(p => supplierProductIds.includes(p.productId))
        );
        return supplierOrders;
    };

    // Lógica de filtrado con verificación de valores
    const filteredSuppliers = suppliers.filter(supplier => {
        const nameMatch = supplier.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const rucMatch = supplier.ruc?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || rucMatch;
    });

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className="container suppliers-container">Cargando proveedores...</div>;
    }

    return (
        <div className="container suppliers-container">
            <h1>Gestión de Proveedores</h1>

            <div className="suppliers-content">
                <div className="suppliers-form-card">
                    <h3>{form.id ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}</h3>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required />
                        <input type="text" name="ruc" value={form.ruc} onChange={handleChange} placeholder="RUC" required />
                        <input type="text" name="contact" value={form.contact} onChange={handleChange} placeholder="Contacto" required />
                        <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Dirección" required />
                        <button type="submit" className="btn btn-primary">{form.id ? 'Actualizar' : 'Guardar'}</button>
                    </form>
                </div>
                
                <div className="suppliers-list-section">
                    <div className="filter-container">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o RUC..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    
                    <SuppliersTable
                        suppliers={currentSuppliers}
                        orders={orders}
                        products={products}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewHistory={handleViewHistory}
                        selectedSupplierId={selectedSupplierId}
                        getPurchaseHistory={getPurchaseHistory}
                    />

                    {filteredSuppliers.length === 0 && (
                        <div className="no-results">No se encontraron proveedores que coincidan con la búsqueda.</div>
                    )}

                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredSuppliers.length}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                </div>
            </div>
        </div>
    );
};

export default Suppliers;