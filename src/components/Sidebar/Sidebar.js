import React from 'react';
import { NavLink } from 'react-router-dom';
import logoImg from './invoicy.png';

//setup
import {auth} from '../../firebase-config';

//context
import useAuthContext from '../../context/auth';

//icons
import StorageIcon from '@material-ui/icons/Storage';
import DescriptionIcon from '@material-ui/icons/Description';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import style from './Sidebar.module.css';

const Sidebar = React.memo(() => {
    const setUserId = useAuthContext().setUserId;

    return (
        <div className={style.sidebar}>
            <img className={style.sidebar__logo} src={logoImg} alt="invoicy" />
            <ul className={style.sidebar__list}>
                <li className={style.sidebar__item}>
                    <NavLink to="/products"><StorageIcon /> Products</NavLink>
                </li>
                <li className={style.sidebar__item}>
                    <NavLink to="/invoices"><DescriptionIcon /> Invoices</NavLink>
                </li>
                <li className={style.sidebar__item}>
                    <NavLink to="/customers"><PeopleIcon /> Customers</NavLink>
                </li>
                <li className={style.sidebar__item}>
                    <NavLink to="/info"><SettingsIcon /> Invoicing info</NavLink>
                </li>
                <li className={[style.sidebar__item, style.sidebar__item_danger].join(' ')}>
                    <button onClick={() => { auth.signOut(); setUserId(null) }}><PowerSettingsNewIcon /> Logout</button>
                </li>
            </ul>
        </div>
    );
});

export default Sidebar;