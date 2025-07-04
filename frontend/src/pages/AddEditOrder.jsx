import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as ordersService from '../services/ordersService';
import * as productsService from '../services/productsService';
import Order from '../models/OrderModel';
import './AddEditOrder.css';

const AddEditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: null,
    order_number: '',
    order_date: new Date().toISOString().split('T')[0],
    num_products: 0,
    final_price: 0,
    status: 'Pending',
    products: [] // Array para almacenar los productos del pedido
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsOptions, setProductsOptions] = useState([]); // Lista de todos los productos disponibles
  
  // Nuevos estados para añadir productos
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(1);

  // Cargar todos los productos disponibles (para el dropdown)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getProducts();
        setProductsOptions(data);
      } catch (err) {
        console.error("Error fetching products for selection:", err);
        // Si hay un error, asegúrate de que productsOptions sea un array vacío para evitar problemas
        setProductsOptions([]);
      }
    };
    fetchProducts();
  }, []);

  // Cargar datos del pedido si es edición
  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await ordersService.getOrderById(id);
          const orderInstance = new Order(data);
          setFormData({
            id: orderInstance.id,
            order_number: orderInstance.order_number,
            order_date: orderInstance.order_date,
            num_products: orderInstance.num_products,
            final_price: orderInstance.final_price,
            status: orderInstance.status,
            products: orderInstance.products || []
          });
        } else {
          setFormData(new Order({
            id: null,
            order_number: '',
            order_date: new Date().toISOString().split('T')[0],
            num_products: 0,
            final_price: 0,
            status: 'Pending',
            products: []
          }));
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

  // Manejar cambios en los campos del formulario principal
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: (type === 'number' || name === 'final_price' || name === 'num_products')
                ? parseFloat(value) || 0
                : value
    }));
  };

  // Función para añadir un producto a la lista del pedido
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
        // Actualizar cantidad si el producto ya existe en el pedido
        updatedProducts = formData.products.map((p, index) =>
          index === existingProductIndex
            ? { ...p, quantity: p.quantity + selectedProductQuantity }
            : p
        );
      } else {
        // Añadir nuevo producto al pedido
        updatedProducts = [...formData.products, {
          productId: productToAdd.id,
          name: productToAdd.name,
          unit_price: productToAdd.unit_price,
          quantity: selectedProductQuantity
        }];
      }

      // Recalcular num_products y final_price
      const newNumProducts = updatedProducts.reduce((sum, p) => sum + p.quantity, 0);
      const newFinalPrice = updatedProducts.reduce((sum, p) => sum + (p.quantity * p.unit_price), 0);

      setFormData(prevData => ({
        ...prevData,
        products: updatedProducts,
        num_products: newNumProducts,
        final_price: newFinalPrice
      }));

      // Resetear la selección del producto para la siguiente adición
      setSelectedProductId('');
      setSelectedProductQuantity(1);
    } else {
      alert('Producto no encontrado.');
    }
  };

  // Función para eliminar un producto de la lista del pedido
  const handleRemoveProductFromOrder = (productIdToRemove) => {
    const updatedProducts = formData.products.filter(p => String(p.productId) !== String(productIdToRemove));

    // Recalcular num_products y final_price
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

    // Validaciones
    if (!formData.order_number.trim()) {
      alert("El número de orden no puede estar vacío.");
      return;
    }
    if (formData.products.length === 0) {
      alert("El pedido debe contener al menos un producto.");
      return;
    }
    // No validamos final_price o num_products porque se calculan automáticamente
    // pero si lo quieres, puedes añadir validación aquí

    try {
      if (id) {
        await ordersService.updateOrder(id, formData);
        alert('Pedido actualizado con éxito!');
      } else {
        await ordersService.createOrder(formData);
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
          <label htmlFor="orderNumber">Número de Orden:</label>
          <input
            type="text"
            id="orderNumber"
            name="order_number"
            className="form-control"
            value={formData.order_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="orderDate">Fecha de Orden:</label>
          <input
            type="date"
            id="orderDate"
            name="order_date"
            className="form-control"
            value={formData.order_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Los campos num_products y final_price ahora se calculan automáticamente */}
        <div className="form-group">
          <label htmlFor="numProducts">Número de Productos:</label>
          <input
            type="number"
            id="numProducts"
            name="num_products"
            className="form-control"
            value={formData.num_products}
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="finalPrice">Precio Final:</label>
          <input
            type="number"
            id="finalPrice"
            name="final_price"
            className="form-control"
            value={Number(formData.final_price).toFixed(2)}
            readOnly // Ahora es de solo lectura
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Estado:</label>
          <select
            id="status"
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pendiente</option>
            <option value="In Progress">En Progreso</option>
            <option value="Completed">Completado</option>
            <option value="Cancelled">Cancelado</option>
          </select>
        </div>

        {/* Sección para añadir y listar productos del pedido */}
        <div className="form-group">
          <label>Añadir Productos al Pedido:</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <select
              className="form-control"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{ flexGrow: 1 }}
            >
              <option value="">-- Selecciona un Producto --</option>
              {productsOptions.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${Number(product.unit_price).toFixed(2)}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="form-control"
              value={selectedProductQuantity}
              onChange={(e) => setSelectedProductQuantity(parseInt(e.target.value) || 1)}
              min="1"
              style={{ width: '80px' }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddProductToOrder}
              style={{ minWidth: 'auto', padding: '10px 15px' }}
            >
              Añadir
            </button>
          </div>

          <label>Productos del Pedido:</label>
          <ul>
            {formData.products && formData.products.length > 0 ? (
              formData.products.map((p, index) => (
                <li key={p.productId}>
                  {p.name} - ${Number(p.unit_price).toFixed(2)} x {p.quantity} unid.
                  <button
                    type="button"
                    className="btn-action btn-delete"
                    onClick={() => handleRemoveProductFromOrder(p.productId)}
                    style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8em' }}
                  >
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