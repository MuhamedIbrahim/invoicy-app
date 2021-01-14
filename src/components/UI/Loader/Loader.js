import React from 'react';
import style from './Loader.module.css';

const Loader = () => {
    return (
        <div className={style.loader}>
            <div className={style.loader__content}>
                <div className={style.lds_ellipsis}><div></div><div></div><div></div><div></div></div>
            </div>            
        </div>
    );
};

export default Loader;