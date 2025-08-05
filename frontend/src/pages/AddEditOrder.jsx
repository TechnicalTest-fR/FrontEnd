import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as ordersService from '../services/ordersService';
import * as productsService from '../services/productsService';
import Order from '../models/OrderModel';
import '../modules/AddEditOrder.css'

const AddEditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(new Order({}));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsOptions, setProductsOptions] = useState([]);
    
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProductQuantity, setSelectedProductQuantity] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productsService.getProducts();
                setProductsOptions(data);
            } catch (err) {
                console.error("Error fetching products for selection:", err);
                setProductsOptions([]);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchOrderData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (id) {
                    const data = await ordersService.getOrderById(id);
                    const orderInstance = new Order(data);
                    setFormData(orderInstance);
                } else {
                    setFormData(new Order({}));
                }
            } catch (err) {
                console.error("Error loading order data:", err);
                setError("Error al cargar los datos del pedido. Por favor, intente de nuevo.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrderData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddProductToOrder = () => {
        if (!selectedProductId) {
            alert('Por favor, selecciona un producto.');
            return;
        }
        if (selectedProductQuantity <= 0) {
            alert('La cantidad debe ser mayor que cero.');
            return;
        }

        const productToAdd = productsOptions.find(p => String(p.id) === String(selectedProductId));

        if (productToAdd) {
            const existingProductIndex = formData.products.findIndex(p => String(p.productId) === String(productToAdd.id));
            let updatedProducts;

            if (existingProductIndex > -1) {
                updatedProducts = formData.products.map((p, index) =>
                    index === existingProductIndex
                        ? { ...p, 
                            quantity: p.quantity + selectedProductQuantity,
                            unit_price: productToAdd.unit_price
                          }
                        : p
                );
            } else {
                updatedProducts = [...formData.products, {
                    productId: productToAdd.id,
                    name: productToAdd.name,
                    unit_price: productToAdd.unit_price,
                    quantity: selectedProductQuantity
                }];
            }

            const newNumProducts = updatedProducts.reduce((sum, p) => sum + p.quantity, 0);
            const newFinalPrice = updatedProducts.reduce((sum, p) => sum + (p.quantity * p.unit_price), 0);

            setFormData(prevData => ({
                ...prevData,
                products: updatedProducts,
                num_products: newNumProducts,
                final_price: newFinalPrice
            }));

            setSelectedProductId('');
            setSelectedProductQuantity(1);
        } else {
            alert('Producto no encontrado.');
        }
    };

    const handleRemoveProductFromOrder = (productIdToRemove) => {
        const updatedProducts = formData.products.filter(p => String(p.productId) !== String(productIdToRemove));

        const newNumProducts = updatedProducts.reduce((sum, p) => sum + p.quantity, 0);
        const newFinalPrice = updatedProducts.reduce((sum, p) => sum + (p.quantity * p.unit_price), 0);

        setFormData(prevData => ({
            ...prevData,
            products: updatedProducts,
            num_products: newNumProducts,
            final_price: newFinalPrice
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.order_number.trim()) {
            alert("El número de orden no puede estar vacío.");
            return;
        }
        if (!formData.customer_name.trim()) {
            alert("El nombre del cliente no puede estar vacío.");
            return;
        }
        if (formData.products.length === 0) {
            alert("El pedido debe contener al menos un producto.");
            return;
        }

        try {
            const orderToSave = { ...formData, updated_at: new Date().toISOString() };
            if (id) {
                await ordersService.updateOrder(id, orderToSave);
                alert('Pedido actualizado con éxito!');
            } else {
                await ordersService.createOrder(orderToSave);
                alert('Pedido añadido con éxito!');
            }
            navigate('/my-orders');
        } catch (err) {
            console.error('Error saving order:', err);
            setError('Error al guardar el pedido. Verifique la consola para más detalles.');
        }
    };

    if (loading) {
        return <div className="container">Cargando formulario de pedido...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1>{id ? 'Editar Pedido' : 'Añadir Nuevo Pedido'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Nombre del Cliente:</label>
                    <input type="text" id="customerName" name="customer_name" className="form-control" value={formData.customer_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="orderNumber">Número de Orden:</label>
                    <input type="text" id="orderNumber" name="order_number" className="form-control" value={formData.order_number} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="orderDate">Fecha de Orden:</label>
                    <input type="date" id="orderDate" name="order_date" className="form-control" value={formData.order_date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="paymentStatus">Estado de Pago:</label>
                    <select id="paymentStatus" name="payment_status" className="form-control" value={formData.payment_status} onChange={handleChange} required >
                        <option value="Pending">Pendiente</option>
                        <option value="Paid">Pagado</option>
                        <option value="Failed">Fallido</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="paymentMethod">Método de Pago:</label>
                    <select id="paymentMethod" name="payment_method" className="form-control" value={formData.payment_method} onChange={handleChange} required >
                        <option value="CASH">CASH</option>
                        <option value="CREDIT_CARD">CREDIT_CARD</option>
                        <option value="PAYPAL">PAYPAL</option>
                        <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="shippingAddress">Dirección de Envío:</label>
                    <input type="text" id="shippingAddress" name="shipping_address" className="form-control" value={formData.shipping_address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="shippingMethod">Método de Envío:</label>
                    <input type="text" id="shippingMethod" name="shipping_method" className="form-control" value={formData.shipping_method} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="trackingNumber">Número de Rastreo:</label>
                    <input type="text" id="trackingNumber" name="tracking_number" className="form-control" value={formData.tracking_number} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="notes">Notas del Pedido:</label>
                    <textarea id="notes" name="notes" className="form-control" value={formData.notes} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Estado General:</label>
                    <select id="status" name="status" className="form-control" value={formData.status} onChange={handleChange} required >
                        <option value="Pending">Pendiente</option>
                        <option value="In Progress">En Progreso</option>
                        <option value="Completed">Completado</option>
                        <option value="Cancelled">Cancelado</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="numProducts">Número de Productos:</label>
                    <input type="number" id="numProducts" name="num_products" className="form-control" value={formData.num_products} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="finalPrice">Precio Final:</label>
                    <input type="number" id="finalPrice" name="final_price" className="form-control" value={Number(formData.final_price).toFixed(2)} readOnly />
                </div>
                <div className="form-group">
                    <label>Añadir Productos al Pedido:</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <select className="form-control" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={{ flexGrow: 1 }} >
                            <option value="">-- Selecciona un Producto --</option>
                            {productsOptions.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - ${Number(product.unit_price).toFixed(2)}
                                </option>
                            ))}
                        </select>
                        <input type="number" className="form-control" value={selectedProductQuantity} onChange={(e) => setSelectedProductQuantity(parseInt(e.target.value) || 1)} min="1" style={{ width: '80px' }} />
                        <button type="button" className="btn btn-secondary" onClick={handleAddProductToOrder} style={{ minWidth: 'auto', padding: '10px 15px' }} >
                            Añadir
                        </button>
                    </div>
                    <label>Productos del Pedido:</label>
                    <ul>
                        {formData.products && formData.products.length > 0 ? (
                            formData.products.map((p, index) => (
                                <li key={p.productId}>
                                    {p.name} - ${Number(p.unit_price).toFixed(2)} x {p.quantity} unid.
                                    <button type="button" className="btn-action btn-delete" onClick={() => handleRemoveProductFromOrder(p.productId)} style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8em' }} >
                                        X
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li>No hay productos añadidos a este pedido.</li>
                        )}
                    </ul>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {id ? 'Actualizar Pedido' : 'Guardar Pedido'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/my-orders')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEditOrder;