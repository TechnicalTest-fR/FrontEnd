import axios from 'axios';
import { API_BASE_URL_ORDERS } from '../environment/environment';

const API_URL = `${API_BASE_URL_ORDERS}/api/orders`;


export const getOrders = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getOrderById = async (id) => {
    try {
        console.log('ordersService - Haciendo GET para pedido con ID:', id);
        console.log('ordersService - URL GET completa:', `${API_URL}/${id}`);
        const response = await axios.get(`${API_URL}/${id}`);
        console.log('ordersService - Respuesta de GET por ID:', response.data);
        return response.data;
    } catch (error) {
        console.error('ordersService - Error en getOrderById:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(API_URL, orderData);
        alert('Orden creada: ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const updateOrder = async (id, orderData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, orderData);
        alert('Orden actualizada: ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error(`Error updating order with ID ${id}:`, error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        alert(`Orden ${id} eliminada.`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting order with ID ${id}:`, error);
        throw error;
    }
};

export const updateOrderStatus = async (id, newStatus) => {
    try {
        const url = `${API_URL}/${id}/status`;
        
        console.log(`[ordersService] Enviando PATCH a: ${url}`);
        console.log(`[ordersService] Body:`, { status: newStatus });

        const response = await axios.patch(url, { status: newStatus });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el estado del pedido ${id}:`, error);
        throw error;
    }
};