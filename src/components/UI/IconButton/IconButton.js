import React from 'react';
import style from './IconButton.module.css';

const IconButton = React.memo(({Icon, children, danger, disabled, onClick}) => {
    return (
        <button
            disabled={disabled ? disabled : false}
            className={[style.button, danger ? style.button_danger : ''].join(' ')}
            onClick={onClick}
        >
            <span className={style.button__icon}>
                <Icon />
            </span>
            <span className={style.button__text}>{children}</span>
        </button>
    );
});

export default IconButton;