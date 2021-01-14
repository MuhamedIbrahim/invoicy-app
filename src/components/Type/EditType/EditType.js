import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import style from '../CreateType/CreateType.module.css';
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

const EditType = ({match}) => {
    //state
    //customer
    const [customer, setCustomer] = useState({});
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerWebsite, setCustomerWebsite] = useState('');
    //product
    const [product, setProduct] = useState({});
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
        setLoading(true);
        db.ref(`${editType}/${userId}/${match.params.id}`).get()
            .then(response => {
                if(response.val()) {
                    const resItem = response.val();
                    if(editType === 'products') {
                        setProduct(resItem);
                        setProductName(resItem.itemName);
                        setProductPrice(resItem.itemPrice);
                        setProductTax(resItem.itemTax);
                    } else if(editType === 'customers') {
                        setCustomer(resItem);
                        setCustomerName(resItem.customerName);
                        setCustomerAddress(resItem.address);
                        setCustomerPhone(resItem.phone);
                        setCustomerEmail(resItem.email);
                        setCustomerWebsite(resItem.website ? resItem.website : '');
                    }
                }
                setLoading(false);
            }).catch(error => {
                console.error(error.message);
                setLoading(false);
            });
    }, [setLoading, editType, match.params.id, userId]);

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
        let updates = {};
        if(editType === 'products') {
            updates = {
                itemName: productName.trim(),
                itemTax: productTax,
                itemPrice: productPrice
            }
        } else if(editType === 'customers') {
            updates = {
                customerName: customerName.trim(),
                website: customerWebsite.trim(),
                address: customerAddress.trim(),
                phone: customerPhone.trim(),
                email: customerEmail.trim()
            }
        }
        db.ref(`${editType}/${userId}/${match.params.id}`).update(updates)
            .then(response => {
                if(editType === 'products') {
                    setProduct(prevItem => ({
                        ...prevItem,
                        itemName: productName,
                        itemTax: productTax,
                        itemPrice: productPrice
                    }));
                } else if(editType === 'customers') {
                    setCustomer(prevItem => ({
                        ...prevItem,
                        customerName: customerName,
                        website: customerWebsite,
                        address: customerAddress,
                        phone: customerPhone,
                        email: customerEmail
                    }));
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
    }, [userId, editType, match.params.id, setLoading, productName, productTax, productPrice, customerName, customerWebsite, customerAddress, customerPhone, customerEmail]);

    //form disabling
    const onDisablingHandler = useCallback(() => {
        if(editType === 'products') {
            return (product.itemName === productName.trim() || !productName?.trim()) && product.itemPrice === productPrice && product.itemTax === productTax;
        } else if(editType === 'customers') {
            return (customer.customerName === customerName?.trim() || !customerName.trim()) && (customer.phone === customerPhone?.trim() || !customerPhone.trim()) && (customer.email === customerEmail?.trim() || !customerEmail.trim()) && (customer.address === customerAddress?.trim() || !customerAddress.trim()) && customer.website === customerWebsite.trim();
        }
    }, [editType, product, customer, productName, productPrice, productTax, customerName, customerPhone, customerEmail, customerAddress, customerWebsite]);

    return (
        <>
            <SaveResult fire={save} type={saveType} />
            <Header title={`Editing ${editType.slice(0, -1)}`} />
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
                        Save changes
                    </Button>
                    <Button secondary onClick={() => history.push(`/${editType}`)}>Cancel</Button>
                </div>
            </section>
        </>
    );
};

export default EditType;