import React, { useState, useEffect, useCallback, useRef } from 'react';
import style from './Info.module.css';
import rawStyle from '../Type/CreateType/CreateType.module.css';
import previewStyle from '../Invoices/ShowInvoice/ShowInvoice.module.css';
import inputStyle from '../UI/Input/Input.module.css';

//components
import Header from '../Header/Header';
import Button from '../UI/Button/Button';
import SaveResult from '../UI/SaveResult/SaveResult';

//setup
import db, { storage } from '../../firebase-config';

//contexts
import useLoading from '../../context/loading';
import useAuthContext from '../../context/auth';

//utils
import AddressFormat from '../../utils/AddressFormat';

const Info = ({history}) => {
    const [info, setInfo] = useState({
        logo: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        website: ''
    });
    const [edit, setEdit] = useState({});
    const [save, setSave] = useState(false);
    const [saveType, setSaveType] = useState('success');

    //contexts
    const setLoading = useLoading().setLoading;
    const userId = useAuthContext().userId;

    //refs
    const newLogo = useRef(null);

    //effects
    useEffect(() => {
        setLoading(true);
        db.ref(`info/${userId}`).get()
            .then(response => {
                if(response.val()) {
                    const resItem = response.val();
                    setInfo(resItem);
                    setEdit(resItem);
                }
                setLoading(false);
            }).catch(error => {
                console.error(error.message);
                setLoading(false);
            });
    }, [setLoading, userId]);

    useEffect(() => {
        let timeOut = null;
        if(save === true) {
            timeOut = setTimeout(() => {
                setSave(false);
            }, 3000);
        }
        return () => {
            if(timeOut) {
                clearTimeout(timeOut);
            }
        }
    }, [save]);

    //callbacks
    const onInputChangeHandler = useCallback((e) => {
        setInfo(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }, []);

    const onUploadHandler = useCallback((e) => {
        if(e.target.files[0]) {
            const newLogoFile = newLogo.current.files[0];
            const nowDate = Date.now();
            const uploadTask = storage.ref(`${userId}/${newLogoFile.name}_${nowDate}`).put(newLogoFile);
            setLoading(true);
            uploadTask.on(
                'state_changed',
                () => {},
                error => { console.error(error.message)},
                () => {
                    storage.ref(userId).child(`${newLogoFile.name}_${nowDate}`).getDownloadURL()
                        .then(url => {
                            setInfo(prevState => ({
                                ...prevState,
                                logo: url
                            }));
                            setLoading(false);
                        })
                        .catch(error => {
                            console.error(error.message);
                            setLoading(false);
                        });
                }
            );
        }
    }, [newLogo, setLoading, userId]);

    const onSubmitHandler = useCallback(() => {
        setLoading(true);
        db.ref(`info/${userId}`).update({
            logo: info.logo,
            name: info.name.trim(),
            address: info.address.trim(),
            phone: info.phone.trim(),
            email: info.email.trim(),
            website: info.website.trim()
        }).then(response => {
                setLoading(false);
                setSave(true);
                setSaveType('success');
            }).catch(error => {
                console.error(error.message);
                setLoading(false);
            })
    }, [setLoading, info, userId]);

    const onCancelHandler = useCallback(() => {
        history.push('/');
    }, [history]);

    return (
        <>
            <SaveResult fire={save} type={saveType} />
            <Header title="Creating customer" />
            <section className={rawStyle.content}>
                <div className={rawStyle.all_fields}>
                    <div className={style.info_preview}>
                        <div className={previewStyle.company__logo}>
                                {info?.logo ?
                                    <img src={info?.logo} alt="Company Logo" />
                                :
                                    <div></div>
                                }
                        </div>
                        <p className={previewStyle.company__name}>{info?.name}</p>
                        {info?.website && <p className={previewStyle.company__website}>{info?.website}</p>}
                        <p className={previewStyle.company__detail}><AddressFormat address={info?.address} /></p>
                        <p className={previewStyle.company__detail}>{info?.phone}</p>
                        <p className={previewStyle.company__detail}>{info?.email}</p>
                    </div>
                    <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Company Logo</label>
                    <input type="file" ref={newLogo} accept="image/*" onChange={onUploadHandler} className={inputStyle.input} name="logo" />
                    <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Company name</label>
                    <input type="text" className={inputStyle.input} name="name" value={info?.name} onInput={e => onInputChangeHandler(e)} />
                    <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Company address</label>
                    <input type="text" className={[inputStyle.input, inputStyle.input_has_note].join(' ')} name="address" value={info?.address} onInput={e => onInputChangeHandler(e)} />
                    <span className={inputStyle.input_note}>Use commas " , " to separate address into multiple lines.</span>
                    <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Company phone</label>
                    <input type="text" className={inputStyle.input} name="phone" value={info?.phone} onInput={e => onInputChangeHandler(e)} />
                    <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Company email address</label>
                    <input type="text" className={inputStyle.input} name="email" value={info?.email} onInput={e => onInputChangeHandler(e)} />
                    <label className={inputStyle.label}>Company website</label>
                    <input type="text" className={inputStyle.input} name="website" value={info?.website} onInput={e => onInputChangeHandler(e)} />
                </div>
                <div className={rawStyle.content__btns}>
                    <Button
                        onClick={onSubmitHandler}
                        disabled={Object.keys(edit).length > 0 ? info?.logo === edit?.logo  && (info?.name?.trim() === edit?.name || !info?.name?.trim()) && (info?.email?.trim() === edit?.email || !info?.email?.trim()) && (info?.phone?.trim() === edit?.phone || !info?.phone?.trim()) && (info?.address?.trim() === edit?.address || !info?.address?.trim()) && info?.website?.trim() === edit?.website : !info?.logo || !info?.name?.trim() || !info?.email?.trim() || !info?.phone?.trim() || !info?.address?.trim()}
                    >
                        Save changes
                    </Button>
                    <Button onClick={onCancelHandler} secondary>Cancel</Button>
                </div>
            </section>
        </>
    );
};

export default Info;