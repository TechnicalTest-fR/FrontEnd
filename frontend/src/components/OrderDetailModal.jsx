// src/components/OrderDetailModal.jsx
import React from 'react';
import { formatDateTime, getStatusStyleClass } from '../utils/helpers'; 

const OrderDetailModal = ({ show, order, onCancel, onEdit, onDelete }) => {
    if (!show || !order) {
        return null;
    }

    const handleActionClick = (e, action, id) => {
        e.stopPropagation();
        onCancel(); 
        action(id);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Detalles del Pedido: {order.order_number}</h2>
                    <button className="btn-close" onClick={onCancel}>&times;</button>
                </div>
                
                <div className="modal-body">
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Nombre del Cliente:</strong> {order.customer_name}</p>
                    <p><strong>Fecha del Pedido:</strong> {formatDateTime(order.order_date)}</p>
                    <p><strong>Estado de Pago:</strong> <span className={getStatusStyleClass(order.payment_status)}>{order.payment_status}</span></p>
                    <p><strong>Método de Pago:</strong> {order.payment_method}</p>
                    <p><strong>Estado General:</strong> <span className={getStatusStyleClass(order.status)}>{order.status}</span></p>
                    <p><strong>Precio Final:</strong> ${Number(order.final_price).toFixed(2)}</p>
                    <hr/>
                    <h3>Detalle de Productos</h3>
                    <ul className="product-list">
                        {order.products && order.products.length > 0 ? (
                            order.products.map((p, index) => (
                                <li key={p.productId || index}> 
                                    {p.name} - ${Number(p.unit_price).toFixed(2)} x {p.quantity} unid.
                                </li>
                            ))
                        ) : (
                            <li>No hay productos en este pedido.</li>
                        )}
                    </ul>
                    <hr/>
                    <h3>Detalles de Envío</h3>
                    <p><strong>Dirección:</strong> {order.shipping_address}</p>
                    <p><strong>Método de Envío:</strong> {order.shipping_method}</p>
                    <p><strong>Número de Rastreo:</strong> {order.tracking_number || 'N/A'}</p>
                    <hr/>
                    <h3>Notas del Pedido</h3>
                    <p>{order.notes || 'No hay notas.'}</p>
                    <hr/>
                    <p><strong>Última Actualización:</strong> {formatDateTime(order.updated_at)}</p>
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>Cerrar</button>
                    <button className="btn btn-primary" onClick={(e) => handleActionClick(e, onEdit, order.id)}>Editar</button>
                    <button className="btn btn-danger" onClick={(e) => handleActionClick(e, onDelete, order.id)}>Eliminar</button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;