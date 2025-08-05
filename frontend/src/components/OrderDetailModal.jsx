import React, { useEffect } from 'react'; // Importamos useEffect para el diagnóstico
import { formatDateTime, getStatusStyleClass } from '../utils/helpers'; 

const OrderDetailModal = ({ show, order, onCancel, onEdit, onDelete }) => {
    // Código de diagnóstico: Muestra el objeto de la orden en la consola
    useEffect(() => {
        if (show && order) {
            console.log("Datos de la orden recibidos en el modal:", order);
        }
    }, [show, order]);
    
    if (!show || !order) {
        return null;
    }

    // Usamos esta variable para asegurarnos de que la lista de productos siempre se acceda correctamente
    const productsList = order.products || order.Products || [];

    const handleActionClick = (e, action, id) => {
        e.stopPropagation();
        onCancel(); 
        action(id);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Order Details: {order.order_number}</h2>
                    <button className="btn-close" onClick={onCancel}>&times;</button>
                </div>
                
                <div className="modal-body">
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Customer Name:</strong> {order.customer_name}</p>
                    <p><strong>Order Date:</strong> {formatDateTime(order.order_date)}</p>
                    <p><strong>Payment Status:</strong> <span className={getStatusStyleClass(order.payment_status)}>{order.payment_status}</span></p>
                    <p><strong>Payment Method:</strong> {order.payment_method}</p>
                    <p><strong>Overall Status:</strong> <span className={getStatusStyleClass(order.status)}>{order.status}</span></p>
                    <p><strong>Final Price:</strong> ${Number(order.final_price).toFixed(2)}</p>
                    <hr/>
                    <h3>Product Details</h3>
                    <ul className="product-list">
                        {productsList.length > 0 ? (
                            productsList.map((p, index) => (
                                <li key={p.productId || index}> 
                                    {p.name} - ${Number(p.OrderProduct.unit_price).toFixed(2)} x {p.OrderProduct.quantity} units.
                                </li>
                            ))
                        ) : (
                            <li>No products in this order.</li>
                        )}
                    </ul>
                    <hr/>
                    <h3>Shipping Details</h3>
                    <p><strong>Address:</strong> {order.shipping_address}</p>
                    <p><strong>Shipping Method:</strong> {order.shipping_method}</p>
                    <p><strong>Tracking Number:</strong> {order.tracking_number || 'N/A'}</p>
                    <hr/>
                    <h3>Order Notes</h3>
                    <p>{order.notes || 'No notes.'}</p>
                    <hr/>
                    <p><strong>Last Updated:</strong> {formatDateTime(order.updated_at)}</p>
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>Close</button>
                    <button className="btn btn-primary" onClick={(e) => handleActionClick(e, onEdit, order.id)}>Edit</button>
                    <button className="btn btn-danger" onClick={(e) => handleActionClick(e, onDelete, order.id)}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;