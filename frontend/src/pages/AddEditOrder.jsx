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
                setError("Error loading order data. Please try again.");
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
            alert('Please, select a product.');
            return;
        }
        if (selectedProductQuantity <= 0) {
            alert('The quantity must be greater than zero.');
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
            alert('Product not found.');
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
            alert("The order number cannot be empty.");
            return;
        }
        if (!formData.customer_name.trim()) {
            alert("The customer name cannot be empty.");
            return;
        }
        if (formData.products.length === 0) {
            alert("The order must contain at least one product.");
            return;
        }

        try {
            const orderToSave = { ...formData, updated_at: new Date().toISOString() };
            if (id) {
                await ordersService.updateOrder(id, orderToSave);
                alert('Order updated successfully!');
            } else {
                await ordersService.createOrder(orderToSave);
                alert('Order added successfully!');
            }
            navigate('/my-orders');
        } catch (err) {
            console.error('Error saving order:', err);
            setError('Error saving order. Check the console for more details.');
        }
    };

    if (loading) {
        return <div className="container">Loading order form...</div>;
    }

    if (error) {
        return <div className="container error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1>{id ? 'Edit Order' : 'Add New Order'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name:</label>
                    <input type="text" id="customerName" name="customer_name" className="form-control" value={formData.customer_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="orderNumber">Order Number:</label>
                    <input type="text" id="orderNumber" name="order_number" className="form-control" value={formData.order_number} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="orderDate">Order Date:</label>
                    <input type="date" id="orderDate" name="order_date" className="form-control" value={formData.order_date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="paymentStatus">Payment Status:</label>
                    <select id="paymentStatus" name="payment_status" className="form-control" value={formData.payment_status} onChange={handleChange} required >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="paymentMethod">Payment Method:</label>
                    <select id="paymentMethod" name="payment_method" className="form-control" value={formData.payment_method} onChange={handleChange} required >
                        <option value="CASH">CASH</option>
                        <option value="CREDIT_CARD">CREDIT_CARD</option>
                        <option value="PAYPAL">PAYPAL</option>
                        <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="shippingAddress">Shipping Address:</label>
                    <input type="text" id="shippingAddress" name="shipping_address" className="form-control" value={formData.shipping_address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="shippingMethod">Shipping Method:</label>
                    <input type="text" id="shippingMethod" name="shipping_method" className="form-control" value={formData.shipping_method} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="trackingNumber">Tracking Number:</label>
                    <input type="text" id="trackingNumber" name="tracking_number" className="form-control" value={formData.tracking_number} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="notes">Order Notes:</label>
                    <textarea id="notes" name="notes" className="form-control" value={formData.notes} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Overall Status:</label>
                    <select id="status" name="status" className="form-control" value={formData.status} onChange={handleChange} required >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="numProducts">Number of Products:</label>
                    <input type="number" id="numProducts" name="num_products" className="form-control" value={formData.num_products} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="finalPrice">Final Price:</label>
                    <input type="number" id="finalPrice" name="final_price" className="form-control" value={Number(formData.final_price).toFixed(2)} readOnly />
                </div>
                <div className="form-group">
                    <label>Add Products to Order:</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <select className="form-control" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={{ flexGrow: 1 }} >
                            <option value="">-- Select a Product --</option>
                            {productsOptions.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - ${Number(product.unit_price).toFixed(2)}
                                </option>
                            ))}
                        </select>
                        <input type="number" className="form-control" value={selectedProductQuantity} onChange={(e) => setSelectedProductQuantity(parseInt(e.target.value) || 1)} min="1" style={{ width: '80px' }} />
                        <button type="button" className="btn btn-secondary" onClick={handleAddProductToOrder} style={{ minWidth: 'auto', padding: '10px 15px' }} >
                            Add
                        </button>
                    </div>
                    <label>Order Products:</label>
                    <ul>
                        {formData.products && formData.products.length > 0 ? (
                            formData.products.map((p, index) => (
                                <li key={p.productId}>
                                    {p.name} - ${Number(p.unit_price).toFixed(2)} x {p.quantity} units.
                                    <button type="button" className="btn-action btn-delete" onClick={() => handleRemoveProductFromOrder(p.productId)} style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8em' }} >
                                        X
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li>No products added to this order.</li>
                        )}
                    </ul>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {id ? 'Update Order' : 'Save Order'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/my-orders')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEditOrder;