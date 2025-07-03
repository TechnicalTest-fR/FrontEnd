import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as ordersService from '../services/ordersService';
import * as productsService from '../services/productsService';
import Order from '../models/OrderModel'; // <--- CORRECCIÓN CLAVE: Asegúrate de importar 'Orden' si tu archivo es Orden.js
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
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsOptions, setProductsOptions] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getProducts();
        setProductsOptions(data);
      } catch (err) {
        console.error("Error fetching products for selection:", err);
        // Opcional: setError para informar al usuario si los productos no cargan
      }
    };
    fetchProducts();
  }, []); // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          // Modo "Editar": Obtener datos de la orden existente
          const data = await ordersService.getOrderById(id);
          // <--- CORRECCIÓN CLAVE AQUÍ: Usar 'Orden' consistentemente
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
          // Modo "Añadir": Inicializar con datos por defecto
          // <--- CORRECCIÓN CLAVE AQUÍ: Usar 'Orden' consistentemente
          setFormData(new Order({ 
            id: null, // Para una nueva orden, el ID es null al inicio
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
  }, [id]); // Se re-ejecuta cuando 'id' cambia (navegar entre editar/añadir)

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: (type === 'number' || name === 'final_price' || name === 'num_products')
                ? parseFloat(value) || 0
                : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.order_number || !formData.final_price || formData.final_price <= 0) {
      alert("Por favor, complete el número de orden y asegúrese de que el precio final sea mayor que 0.");
      return;
    }

    try {
      if (id) {
        // Si hay ID, actualizamos
        await ordersService.updateOrder(id, formData);
        alert('Pedido actualizado con éxito!');
      } else {
        // Si no hay ID, creamos
        await ordersService.createOrder(formData);
        alert('Pedido añadido con éxito!');
      }
      navigate('/my-orders'); // Redirigir a la lista de pedidos después de guardar
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

        <div className="form-group">
          <label htmlFor="numProducts">Número de Productos:</label>
          <input
            type="number"
            id="numProducts"
            name="num_products"
            className="form-control"
            value={formData.num_products}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="finalPrice">Precio Final:</label>
          <input
            type="number"
            id="finalPrice"
            name="final_price"
            className="form-control"
            value={formData.final_price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
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

        {/* Sección de Productos (sin funcionalidad de añadir por ahora) */}
        <div className="form-group">
          <label>Productos:</label>
          <ul>
            {formData.products && formData.products.length > 0 ? (
              formData.products.map((p, index) => (
                <li key={p.id || index}>{p.name} - ${p.price || '0.00'}</li>
              ))
            ) : (
              <li>No hay productos añadidos.</li>
            )}
          </ul>
          <button
            type="button"
            className="btn btn-secondary"
            // onClick={() => handleAddProduct()} // Puedes implementar esta función más tarde
          >
            Añadir Producto
          </button>
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