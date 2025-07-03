import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="btn-confirm">Confirmar</button>
                    <button onClick={onCancel} className="btn-cancel">Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;