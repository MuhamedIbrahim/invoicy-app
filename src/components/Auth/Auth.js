import React, { useState, useCallback } from 'react';
import style from './Auth.module.css';
import logo from './invoicy.png';
import inputStyle from '../UI/Input/Input.module.css';

//components
import Button from '../UI/Button/Button';

//setup
import {auth} from '../../firebase-config';

//context
import useAuthContext from '../../context/auth';
import useLoading from '../../context/loading';

const Auth = () => {
    //state
    const [email, setEmail] = useState('user@mail.com');
    const [password, setPassword] = useState('123___');

    //context
    const setUserId = useAuthContext().setUserId;
    const setLoading = useLoading().setLoading;

    //callbacks
    const onSignHandler = useCallback(() => {
        setLoading(true);
        auth.signInWithEmailAndPassword(email, password)
            .then(response => {
                if(response?.user?.uid) {
                    setUserId(response?.user?.uid);
                }
                setLoading(false);
            }).catch(error => {
                console.error(error.message);
                setLoading(false);
            })
    }, [email, password, setLoading, setUserId]);

    return (
        <div className={style.auth}>
            <div className={style.auth__content}>
                <img src={logo} alt="Invoicy" />
                <div className={style.auth__sign}>
                    <label>Email address</label>
                    <input type="email" className={inputStyle.input} value={email} onInput={e => setEmail(e.target.value)} />
                    <label>Password</label>
                    <input type="password" className={inputStyle.input} value={password} onInput={e => setPassword(e.target.value)} />
                    <Button disabled={email !=='user@mail.com' || !email || password !=='123___' || !password} onClick={onSignHandler}>Sign in</Button>
                </div>
            </div>
        </div>
    );
};

export default Auth;