import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import style from './CreateType.module.css';
import inputStyle from '../../UI/Input/Input.module.css';

//components
import Header from '../../Header/Header';
import SaveResult from '../../UI/SaveResult/SaveResult';
import Button from '../../UI/Button/Button';

//setup
import db from '../../../firebase-config';

//contexts
import useLoading from '../../../context/loading';
import useAuthContext from '../../../context/auth';

//utils
import generateTypeId from '../../../utils/typesId';

const CreateType = ({match}) => {
    //state
    //customer
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerWebsite, setCustomerWebsite] = useState('');
    //product
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productTax, setProductTax] = useState(0);
    //saving
    const [save, setSave] = useState(false);
    const [saveType, setSaveType] = useState('success');

    //editType string
    const editType = useMemo(() => match.path.split('/')[1], [match.path]);

    //history
    const history = useHistory();

    //contexts
    const setLoading = useLoading().setLoading;
    const userId = useAuthContext().userId;

    //memos
    const editInputs = {
        products: [
            {
                label: 'Name',
                inputType: 'text',
                value: productName,
                onInput: setProductName,
                inputNote: false,
                required: true
            },
            {
                label: 'Unit price',
                inputType: 'number',
                value: productPrice,
                onInput: setProductPrice,
                inputNote: false,
                required: true
            },
            {
                label: 'Unit tax',
                inputType: 'number',
                value: productTax,
                onInput: setProductTax,
                inputNote: false,
                required: true
            }
        ],
        customers: [
            {
                label: 'Company/personal name',
                inputType: 'text',
                value: customerName,
                onInput: setCustomerName,
                inputNote: false,
                required: true
            },
            {
                label: 'Company/personal address',
                inputType: 'text',
                value: customerAddress,
                onInput: setCustomerAddress,
                inputNote: 'Use commas " , " to separate address into multiple lines.',
                required: true
            },
            {
                label: 'Company/personal phone',
                inputType: 'text',
                value: customerPhone,
                onInput: setCustomerPhone,
                inputNote: false,
                required: true
            },
            {
                label: 'Company/personal email Address',
                inputType: 'text',
                value: customerEmail,
                onInput: setCustomerEmail,
                inputNote: false,
                required: true
            },
            {
                label: 'Company/personal website',
                inputType: 'text',
                value: customerWebsite,
                onInput: setCustomerWebsite,
                inputNote: false
            }
        ]
    };

    //effects
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
    const onSubmitEditHandler = useCallback(() => {
        setLoading(true);
        db.ref(`${editType}/${userId}`).limitToLast(1).once("value")
            .then(idResponse => {
                let lastAddedId = null;
                if(idResponse.val()) {
                    if(editType === 'products') {
                        lastAddedId = Object.values(idResponse.val())[0].itemId;
                    } else if(editType === 'customers') {
                        lastAddedId = Object.values(idResponse.val())[0].customerId;
                    }
                }
                const generatedId = generateTypeId(editType.slice(0,1).toUpperCase(), lastAddedId);
                let updates = {};
                if(editType === 'products') {
                    updates = {
                        itemName: productName.trim(),
                        itemTax: productTax,
                        itemPrice: productPrice,
                        itemId: generatedId
                    }
                } else if(editType === 'customers') {
                    updates = {
                        customerName: customerName.trim(),
                        website: customerWebsite.trim(),
                        address: customerAddress.trim(),
                        phone: customerPhone.trim(),
                        email: customerEmail.trim(),
                        customerId: generatedId
                    }
                }
                db.ref(`${editType}/${userId}`).push(updates)
                    .then(response => {
                        if(editType === 'products') {
                            setProductName('');
                            setProductPrice(0);
                            setProductTax(0);
                        } else if(editType === 'customers') {
                            setCustomerName('');
                            setCustomerAddress('');
                            setCustomerPhone('');
                            setCustomerEmail('');
                            setCustomerWebsite('');
                        }
                        setLoading(false);
                        setSave(true);
                        setSaveType('success');
                    }).catch(error => {
                        setLoading(false);
                        setSave(true);
                        setSaveType('error');
                        console.error(error.message);
                    });
            }).catch(idError => {
                setLoading(false);
                setSave(true);
                setSaveType('error');
                console.error(idError.message);
            })
    }, [userId, editType, setLoading, productName, productTax, productPrice, customerName, customerWebsite, customerAddress, customerPhone, customerEmail]);

    //form disabling
    const onDisablingHandler = useCallback(() => {
        if(editType === 'products') {
            return !productName.trim() || !productPrice || !productTax;
        } else if(editType === 'customers') {
            return !customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || !customerAddress.trim();
        }
    }, [editType, productName, productPrice, productTax, customerName, customerPhone, customerEmail, customerAddress]);

    return (
        <>
            <SaveResult fire={save} type={saveType} />
            <Header title={`Creating ${editType.slice(0, -1)}`} />
            <section className={style.content}>
                <div className={style.all_fields}>
                    {editInputs[editType].map((inputElm, index) => (
                        <React.Fragment key={index}>
                            <label className={[inputStyle.label, inputElm.required ? inputStyle.label_required : ''].join(' ')}>{inputElm.label}</label>
                            <input
                                className={[inputStyle.input, inputElm.inputNote ? inputStyle.input_has_note : ''].join(' ')}
                                type={inputElm.inputType}
                                value={inputElm.value}
                                onInput={e => inputElm.onInput(e.target.value)} 
                            />
                            {inputElm.inputNote && <span className={inputStyle.input_note}>{inputElm.inputNote}</span>}
                        </React.Fragment>
                    ))}
                </div>
                <div className={style.content__btns}>
                    <Button
                        onClick={onSubmitEditHandler}
                        disabled={onDisablingHandler()}
                    >
                        Save {editType.slice(0, -1)}
                    </Button>
                    <Button secondary onClick={() => history.push(`/${editType}`)}>Cancel</Button>
                </div>
            </section>
        </>
    );
};

export default CreateType;