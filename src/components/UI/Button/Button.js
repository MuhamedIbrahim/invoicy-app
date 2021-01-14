import React from 'react';
import style from './Button.module.css';

const Button = React.memo(({children, disabled, secondary, submit, onClick, danger}) => {
    return (
        <button
            disabled={disabled ? disabled : false}
            className={[style.button, secondary ? style.button__secondary : '', danger ? style.button__danger : ''].join(' ')}
            type={submit ? 'submit' : 'button'}
            onClick={onClick}
        >
            {children}
        </button>
    );
});

export default Button;