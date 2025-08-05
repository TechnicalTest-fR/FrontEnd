import axios from 'axios';
import { API_BASE_URL_SUPPLIERS } from '../environment/environment';

const API_URL = `${API_BASE_URL_SUPPLIERS}/suppliers`;

export const getSuppliers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};

export const addSupplier = async (supplierData) => {
    try {
        const response = await axios.post(API_URL, supplierData);
        alert('Proveedor añadido: ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
};

export const updateSupplier = async (id, supplierData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, supplierData);
        alert('Proveedor actualizado: ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error(`Error updating supplier with ID ${id}:`, error);
        throw error;
    }
};

export const deleteSupplier = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        alert('Proveedor eliminado: ' + JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error(`Error deleting supplier with ID ${id}:`, error);
        throw error;
    }
};