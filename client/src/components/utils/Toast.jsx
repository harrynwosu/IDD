import { useState, useEffect } from 'react';

import '../../styles/Toast.css';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Toast notification lasts for 3 seconds before fading out

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${type}`}>
            <span>{message}</span>
            <button
                className='toast-close'
                onClick={onClose}
            >
                &times;
            </button>
        </div>
    );
};

export default Toast;
