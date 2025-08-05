import axios from 'axios';
import { API_BASE_URL_PRODUCTS } from '../environment/environment';

const API_URL = `${API_BASE_URL_PRODUCTS}/products`;

export const getProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        console.log('productService - Haciendo GET para pedido con ID:', id);
        console.log('productService - URL GET completa:', `${API_URL}/${id}`);
        const response = await axios.get(`${API_URL}/${id}`);
        console.log('productService - Respuesta de GET por ID:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await axios.post(API_URL, productData);
        alert('Producto añadido (simulado): ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, productData);
        alert('Producto actualizado (simulado): ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${id}:`, error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        alert('Producto eliminado (simulado): ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error(`Error deleting product with ID ${id}:`, error);
        throw error;
    }
};