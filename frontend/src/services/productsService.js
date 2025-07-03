import axios from 'axios';
import { API_BASE_URL_PRODUCTS } from '../environment/environment'; // Importamos la URL para productos

// Usamos la URL base importada para productos
const API_URL = `${API_BASE_URL_PRODUCTS}/products`; // Endpoint de productos de FakeStoreAPI

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
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        // FakeStoreAPI tiene un endpoint POST para productos, pero no los persiste.
        // Solo simula una respuesta exitosa.
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
        // FakeStoreAPI tiene un endpoint PUT para productos, pero no los persiste.
        // Solo simula una respuesta exitosa.
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
        // FakeStoreAPI tiene un endpoint DELETE para productos, pero no los persiste.
        // Solo simula una respuesta exitosa.
        const response = await axios.delete(`${API_URL}/${id}`);
        alert('Producto eliminado (simulado): ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error(`Error deleting product with ID ${id}:`, error);
        throw error;
    }
};