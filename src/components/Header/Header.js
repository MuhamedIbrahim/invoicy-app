import React from 'react';
import style from './Header.module.css';
import Avatar from '@material-ui/core/Avatar';


const Header = React.memo(({title}) => {
    return (
        <header className={style.header}>
            <h5 className={style.header__title}>{title}</h5>
            <div className={style.header__user}>
                <Avatar alt="muhamed" className={style.header__avatar} />
                <span>user@mail.com</span>
            </div>
        </header>
    );
});

export default Header;