// src/components/OrderTable.jsx
import React from 'react';
import '../modules/TableEffects.css'; 
import { formatDate, getStatusStyleClass } from '../utils/helpers'; 

const OrderTable = ({ orders, onEdit, onDelete, onChangeStatus, onViewDetails }) => {
    
    const handleStatusChange = (orderId, newStatus, e) => {
        e.stopPropagation();
        onChangeStatus(orderId, newStatus);
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nº Pedido</th>
                        <th>Fecha</th>
                        <th>Nombre del Cliente</th>
                        <th>Estado de Pago</th>
                        <th>Nº Productos</th>
                        <th>Precio Final</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No hay pedidos para mostrar.</td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.order_number}</td>
                                <td>{formatDate(order.order_date)}</td>
                                <td>{order.customer_name}</td>
                                <td>
                                    <span className={getStatusStyleClass(order.payment_status)}>
                                        {order.payment_status}
                                    </span>
                                </td>
                                <td>{order.num_products}</td>
                                <td>${order.final_price ? Number(order.final_price).toFixed(2) : '0.00'}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value, e)}
                                        className={`status-select ${getStatusStyleClass(order.status)}`}
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En Progreso">En Progreso</option>
                                        <option value="Completado">Completado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </td>
                                <td className="actions-cell"> 
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onViewDetails(order); }} 
                                        className="btn btn-view btn-sm"
                                    >
                                        Detalles
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onEdit(order.id); }} 
                                        className="btn btn-edit btn-sm"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDelete(order.id); }} 
                                        className="btn btn-delete btn-sm"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;