import React from 'react';
import style from './Modal.module.css';

const Modal = ({children}) => {
    return (
        <div className={style.modal}>
            <div className={style.modal__content}>
                {children}
            </div>
        </div>
    );
};

export default Modal;