import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ordersService from '../services/ordersService';
import OrderTable from '../components/OrderTable';
import ConfirmationModal from '../components/ConfirmationModal';
import '../style.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [orderToDeleteId, setOrderToDeleteId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ordersService.getOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError('Error al cargar los pedidos. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAddOrder = () => {
        navigate('/add-order');
    };

    const handleEditOrder = (id) => {
        navigate(`/add-order/${id}`);
    };

    const handleDeleteClick = (id) => {
        setOrderToDeleteId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowModal(false);
        if (orderToDeleteId) {
            try {
                await ordersService.deleteOrder(orderToDeleteId);
                alert('Pedido eliminado con éxito!');
                fetchOrders();
            } catch (err) {
                console.error('Failed to delete order:', err);
                alert('Error al eliminar el pedido.');
            } finally {
                setOrderToDeleteId(null);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowModal(false);
        setOrderToDeleteId(null);
    };

    const handleChangeOrderStatus = async (id, newStatus) => {
        try {
            await ordersService.updateOrderStatus(id, newStatus);
            alert(`Estado del pedido ${id} actualizado a ${newStatus}`);
            fetchOrders();
        } catch (err) {
            console.error('Failed to update order status:', err);
            alert('Error al actualizar el estado del pedido.');
        }
    };


    if (loading) {
        return <div className="container">Cargando pedidos...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Mis Pedidos</h1>

            <button onClick={handleAddOrder} className="btn-primary" style={{ marginBottom: '20px' }}>
                Añadir Nuevo Pedido
            </button>

            <OrderTable
                orders={orders}
                onEdit={handleEditOrder}
                onDelete={handleDeleteClick}
                onChangeStatus={handleChangeOrderStatus}
            />

            <ConfirmationModal
                show={showModal}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que quieres eliminar este pedido? Esta acción es irreversible."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default MyOrders;