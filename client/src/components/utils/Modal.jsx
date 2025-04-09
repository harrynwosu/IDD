import { useEffect } from 'react';
import PropTypes from 'prop-types';

import '../../styles/Modal.css';

const CloseIcon = () => (
    <svg
        width='14'
        height='14'
        viewBox='0 0 14 14'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z'
            fill='currentColor'
        />
    </svg>
);

const Modal = ({ isOpen, onClose, title, children }) => {
    // Close on escape key press
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscapeKey);

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on background click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className='modal-backdrop'
            onClick={handleBackdropClick}
        >
            <div className='modal-container'>
                <div className='modal-header'>
                    <h2>{title}</h2>
                    <button
                        className='modal-close-button'
                        onClick={onClose}
                        aria-label='Close'
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className='modal-content'>{children}</div>
                <div className='modal-footer'>
                    <button
                        className='modal-button'
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default Modal;
