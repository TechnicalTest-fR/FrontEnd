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
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order with ID ${id}:`, error);
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

export const updateOrderStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, { status });
        alert(`Estado de la orden ${id} actualizado a ${status}.`);
        return response.data;
    } catch (error) {
        console.error(`Error updating status for order with ID ${id}:`, error);
        throw error;
    }
};