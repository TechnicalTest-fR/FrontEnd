// src/utils/helpers.js
/**
 * Formatea una cadena de fecha a un formato 'DD/MM/YYYY'.
 * @param {string} dateString La fecha en formato ISO.
 * @returns {string} La fecha formateada.
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return dateString;
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
};

/**
 * Formatea una cadena de fecha a un formato 'DD/MM/YYYY hh:mm'.
 * @param {string} dateString La fecha en formato ISO.
 * @returns {string} La fecha y hora formateada.
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return dateString;
    }
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
};

/**
 * Devuelve la clase CSS correspondiente a un estado de pedido o de pago.
 * @param {string} status El estado.
 * @returns {string} El nombre de la clase CSS.
 */
export const getStatusStyleClass = (status) => {
    if (!status) return '';
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
        case 'completed':
        case 'paid':
        case 'completado':
            return 'status-completed';
        case 'pending':
        case 'pendiente':
            return 'status-pending';
        case 'in progress':
        case 'en progreso':
            return 'status-in-progress';
        case 'cancelled':
        case 'failed':
        case 'cancelado':
            return 'status-cancelled';
        default:
            return '';
    }
};