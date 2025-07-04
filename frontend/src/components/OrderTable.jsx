import React from 'react';

const OrderTable = ({ orders, onEdit, onDelete, onChangeStatus }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return { color: 'orange', fontWeight: 'bold' };
            case 'In Progress': return { color: 'blue', fontWeight: 'bold' };
            case 'Completed': return { color: 'green', fontWeight: 'bold' };
            default: return {};
        }
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nº Pedido</th>
                        <th>Fecha</th>
                        <th>Nº Productos</th>
                        <th>Precio Final</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No hay pedidos para mostrar.</td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.order_number}</td>
                                <td>{formatDate(order.order_date)}</td>
                                <td>{order.num_products}</td>
                                <td>${order.final_price ? Number(order.final_price).toFixed(2) : '0.00'}</td>
                                <td>
                                    <span style={getStatusStyle(order.status)}>{order.status}</span>
                                    {order.status !== 'Completed' && (
                                        <select
                                            value={order.status}
                                            onChange={(e) => onChangeStatus(order.id, e.target.value)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    )}
                                </td>
                                <td>
                                    {order.status !== 'Completed' ? (
                                        <>
                                            <button onClick={() => onEdit(order.id)} className="btn-action btn-edit">Edit</button>
                                            <button onClick={() => onDelete(order.id)} className="btn-action btn-delete">Delete</button>
                                        </>
                                    ) : (
                                        <span style={{ color: '#888' }}>Pedido Completado</span>
                                    )}
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