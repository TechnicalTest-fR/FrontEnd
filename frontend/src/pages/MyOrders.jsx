// src/pages/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ordersService from '../services/ordersService'; 
import OrderTable from '../components/OrderTable';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../components/ConfirmationModal';
import OrderDetailModal from '../components/OrderDetailModal';
import '../style.css';
import '../modules/TableEffects.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('');
    const [numProductsFilter, setNumProductsFilter] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToDeleteId, setOrderToDeleteId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ordersService.getOrders();
            const processedOrders = data.map(order => ({
                ...order,
                num_products: order.products ? order.products.length : 0
            }));
            setOrders(processedOrders);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError('Error loading orders. Please try again.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    const handlePaymentStatusChange = (e) => {
        setPaymentStatusFilter(e.target.value);
        setCurrentPage(1);
    };
    const handleOrderStatusChange = (e) => {
        setOrderStatusFilter(e.target.value);
        setCurrentPage(1);
    };
    const handleNumProductsChange = (e) => {
        setNumProductsFilter(e.target.value);
        setCurrentPage(1);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearchTerm = order.order_number && order.order_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPaymentStatus = paymentStatusFilter === '' || order.payment_status === paymentStatusFilter;
        const matchesOrderStatus = orderStatusFilter === '' || order.status === orderStatusFilter;
        const matchesNumProducts = numProductsFilter === '' || (order.num_products !== undefined && order.num_products === parseInt(numProductsFilter, 10));
        
        return matchesSearchTerm && matchesPaymentStatus && matchesOrderStatus && matchesNumProducts;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAddOrder = () => navigate('/add-order');
    const handleEditOrder = (id) => navigate(`/add-order/${id}`);
    
    const handleDeleteClick = (id) => {
        setOrderToDeleteId(id);
        setShowDeleteModal(true);
    };
    
    const handleConfirmDelete = async () => {
        try {
            await ordersService.deleteOrder(orderToDeleteId);
            setOrders(orders.filter(order => order.id !== orderToDeleteId));
            setShowDeleteModal(false);
            setOrderToDeleteId(null);
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };
    
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setOrderToDeleteId(null);
    };
    
    // src/pages/MyOrders.jsx
    const handleChangeOrderStatus = async (id, newStatus) => {
        try {
            // updatedData contiene solo el campo que queremos actualizar
            const updatedData = { status: newStatus };
            
            // Ahora, esta llamada usa la función `updateOrder` que tiene PATCH
            const updatedOrder = await ordersService.updateOrder(id, updatedData); 
            
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === id ? { ...order, status: updatedOrder.status } : order
                )
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };
    
    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return <div className="container">Loading orders...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Orders</h1>
            <div className="table-actions">
                <button onClick={handleAddOrder} className="btn-primary">
                    New order
                </button>
                <div className="filters-container">
                    <input
                        type="text"
                        placeholder="Order #..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <select value={paymentStatusFilter} onChange={handlePaymentStatusChange} className="filter-select">
                        <option value="">Payment Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <select value={orderStatusFilter} onChange={handleOrderStatusChange} className="filter-select">
                        <option value="">Status</option>
                        <option value="Pendiente">Pending</option>
                        <option value="En Progreso">In Progress</option>
                        <option value="Completado">Completed</option>
                        <option value="Cancelado">Canceled</option>
                    </select>
                    <input
                        type="number"
                        placeholder="# Products"
                        value={numProductsFilter}
                        onChange={handleNumProductsChange}
                        className="filter-input"
                    />
                </div>
            </div>
            
            <OrderTable
                orders={currentOrders}
                onEdit={handleEditOrder}
                onDelete={handleDeleteClick}
                onChangeStatus={handleChangeOrderStatus}
                onViewDetails={handleViewDetails}
            />
            {filteredOrders.length === 0 && (
                <div className="no-results">No results found.</div>
            )}

            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredOrders.length}
                currentPage={currentPage}
                paginate={paginate}
            />

            <ConfirmationModal
                show={showDeleteModal}
                title="Confirm Deletion"
                message="Are you sure you want to delete this order?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <OrderDetailModal
                show={showDetailModal}
                order={selectedOrder}
                onCancel={handleCloseDetailModal}
                onEdit={handleEditOrder}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default MyOrders;