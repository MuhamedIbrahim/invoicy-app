import React, { useState, useEffect, useCallback } from 'react';
import style from './PublishInvoice.module.css';
import inputStyle from '../../UI/Input/Input.module.css';

//components
import Header from '../../Header/Header';
import Button from '../../UI/Button/Button';
import DatePicker from '../../UI/DatePicker/DatePicker';
import IconButton from '../../UI/IconButton/IconButton';
import Item from './Item/Item';
import CurrencyFormat from 'react-currency-format';
import SaveResult from '../../UI/SaveResult/SaveResult';

//icons
import AddIcon from '@material-ui/icons/Add';

//setup
import db from '../../../firebase-config';

//utils
import orderData from '../../../utils/orderData';
import generateTypeId from '../../../utils/typesId';

//context
import useLoading from '../../../context/loading';
import useAuthContext from '../../../context/auth';

const PublishInvoice = ({edit, match, history}) => {
    //state
    const [editedInvoice, setEditedInvoice] = useState({});
    const [invoice, setInvoice] = useState({
        desc: '',
        customer: 'default',
        type: 'default',
        date: null,
        dueDate: null
    });
    const [invoiceProducts, setInvoiceProducts] = useState([]);
    const [prodCustomers, setProdCustomers] = useState({});
    const [save, setSave] = useState(false);
    const [saveType, setSaveType] = useState('success');

    //contexts
    const setLoading = useLoading().setLoading;
    const userId = useAuthContext().userId;

    //effects
    useEffect(() => {
        setLoading(true);
        db.ref(`products/${userId}`).get()
            .then(productsResponse => {
                db.ref(`customers/${userId}`).get()
                    .then(customersResponse => {
                        if(edit) {
                            db.ref(`invoices/${userId}/${match.params.id}`).get()
                                .then(invoiceResponse => {
                                    const invoiceRes = invoiceResponse.val();
                                    setEditedInvoice(invoiceRes);
                                    setInvoice({
                                        desc: invoiceRes.invoiceDesc,
                                        customer: `${invoiceRes.customer.customerId}___${invoiceRes.customer.customerMainId}`,
                                        type: invoiceRes.invoiceType,
                                        date: new Date(invoiceRes.createdDate),
                                        dueDate: new Date(invoiceRes.dueDate),
                                        products: invoiceRes.products
                                    });
                                    setInvoiceProducts(invoiceRes.products);
                                    setLoading(false);
                                }).catch(invoiceError => {
                                    setLoading(false);
                                    console.error(invoiceError.message);
                                })
                        }
                        setProdCustomers({
                            products: orderData(productsResponse),
                            customers: orderData(customersResponse)
                        });
                        setLoading(false);
                    }).catch(customersError => {
                        setLoading(false);
                        console.error(customersError.message);
                    });
            }).catch(productsError => {
                setLoading(false);
                console.error(productsError.message);
            });
    }, [setLoading, edit, match.params.id, userId]);

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
    const onCalculatePriceHandler = useCallback((type) => {
        switch(type) {
            case 'subtotal':
                if(invoiceProducts.length > 0) {
                    return invoiceProducts.reduce((acc, cur) => acc + (cur?.data?.itemQuantity > 0 ? cur.data.itemFreeTotal : 0), 0);
                } else {
                    return 0;
                }
            case 'tax':
                if(invoiceProducts.length > 0) {
                    return invoiceProducts.reduce((acc, cur) => acc + (cur?.data?.itemQuantity > 0 ? (parseFloat(cur.data.itemTax) * cur.data.itemQuantity) : 0), 0)
                } else {
                    return 0;
                }
            case 'totaldue':
                if(invoiceProducts.length > 0) {
                    return invoiceProducts.reduce((acc, cur) => acc + (cur?.data?.itemQuantity > 0 ? cur.data.itemTotal : 0), 0)
                } else {
                    return 0;
                }
            default:
                return 0;
        }
    }, [invoiceProducts]);

    const onAddProductHandler = useCallback(() => {
        setInvoiceProducts(prevProducts => ([
            ...prevProducts,
            {
                id: Date.now()
            }
        ]));
    }, []);

    const onDeleteProductHandler = useCallback((id) => {
        setInvoiceProducts(prevProducts => (
            prevProducts.filter(item => item.id !== id)
        ));
    }, []);

    const onDisablingSubmitHandler = useCallback(() => {
        let flag = true;
        if(edit) {
            let higherFlag = false;
            if(invoiceProducts.length === 0) {
                return true;
            } else {
                invoiceProducts.forEach((product, index) => {
                    if(invoice.products[index]?.data.itemTrueId !== `${product?.data?.itemId}___${product?.data?.itemMainId}` || invoice.products[index]?.data?.itemQuantity !== product?.data?.itemQuantity) {
                            flag = false;
                    }
                    if(!product?.data?.itemQuantity || !product?.data?.itemName) {
                        flag = true;
                        higherFlag = true;
                    }
                });
            }
            if((editedInvoice.invoiceDesc === invoice.desc?.trim() || !invoice.desc?.trim()) && editedInvoice.customer.customerTrueId === invoice.customer && editedInvoice.invoiceType === invoice.type && editedInvoice.createdDate === invoice.date.getTime() && editedInvoice.dueDate === invoice.dueDate.getTime()) {
                return flag;
            } else {
                if(flag && higherFlag) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            if(invoiceProducts.length === 0) {
                return true;
            }
            invoiceProducts.forEach(item => {
                if(!item?.data?.itemQuantity || !item?.data?.itemName) {
                    flag = false;
                }
            });
            return !invoice.desc?.trim() || invoice.customer === 'default' || invoice.type === 'default' || !invoice.date || !invoice.dueDate || !flag;
        }
    }, [edit, invoiceProducts, invoice, editedInvoice]);

    const onSaveHandler = useCallback(() => {
        setLoading(true);
        const customerIndex = prodCustomers.customers.findIndex(elm => elm.data.customerId === invoice.customer.split('___')[0] && elm.id === invoice.customer.split('___')[1]);
        if(edit) {
            db.ref(`invoices/${userId}/${match.params.id}`).update({
                invoiceDesc: invoice.desc?.trim(),
                invoiceType: invoice.type,
                createdDate: new Date(invoice.date).getTime(),
                dueDate: new Date(invoice.dueDate).getTime(),
                customer: {
                    address: prodCustomers.customers[customerIndex].data.address,
                    customerMainId: prodCustomers.customers[customerIndex].id,
                    customerId: prodCustomers.customers[customerIndex].data.customerId,
                    customerTrueId: `${prodCustomers.customers[customerIndex].data.customerId}___${prodCustomers.customers[customerIndex].id}`,
                    customerName: prodCustomers.customers[customerIndex].data.customerName,
                    email: prodCustomers.customers[customerIndex].data.email,
                    phone: prodCustomers.customers[customerIndex].data.phone,
                    website: prodCustomers.customers[customerIndex].data.website
                },
                totalTax: onCalculatePriceHandler('tax'),
                subtotal: onCalculatePriceHandler('subtotal'),
                totalDue: onCalculatePriceHandler('totaldue'),
                products: invoiceProducts
            }).then(response => {
                setEditedInvoice(prevState => ({
                    ...prevState,
                    customer: {
                        address: prodCustomers.customers[customerIndex].data.address,
                        customerMainId: prodCustomers.customers[customerIndex].id,
                        customerId: prodCustomers.customers[customerIndex].data.customerId,
                        customerTrueId: `${prodCustomers.customers[customerIndex].data.customerId}___${prodCustomers.customers[customerIndex].id}`,
                        customerName: prodCustomers.customers[customerIndex].data.customerName,
                        email: prodCustomers.customers[customerIndex].data.email,
                        phone: prodCustomers.customers[customerIndex].data.phone,
                        website: prodCustomers.customers[customerIndex].data.website
                    },
                    invoiceType: invoice.type,
                    createdDate: new Date(invoice.date).getTime(),
                    dueDate: new Date(invoice.dueDate).getTime(),
                    totalTax: onCalculatePriceHandler('tax'),
                    subtotal: onCalculatePriceHandler('subtotal'),
                    totalDue: onCalculatePriceHandler('totaldue'),
                    products: invoiceProducts
                }));
                setLoading(false);
                setSave(true);
                setSaveType('success');
            }).catch(error => {
                setLoading(false);
                setSave(true);
                setSaveType('error');
                console.error(error.message);
            });
        } else {
            db.ref(`invoices/${userId}`).limitToLast(1).once("value")
                .then(response => {
                    let lastAddedId = null;
                    if(response.val()) {
                        lastAddedId = Object.values(response.val())[0].invoiceId;
                    }
                    const invoiceId = generateTypeId('I', lastAddedId);
                    db.ref(`invoices/${userId}`).push({
                        invoiceId: invoiceId,
                        invoiceDesc: invoice.desc?.trim(),
                        invoiceType: invoice.type,
                        createdDate: new Date(invoice.date).getTime(),
                        dueDate: new Date(invoice.dueDate).getTime(),
                        customer: {
                            address: prodCustomers.customers[customerIndex].data.address,
                            customerMainId: prodCustomers.customers[customerIndex].id,
                            customerId: prodCustomers.customers[customerIndex].data.customerId,
                            customerTrueId: `${prodCustomers.customers[customerIndex].data.customerId}___${prodCustomers.customers[customerIndex].id}`,
                            customerName: prodCustomers.customers[customerIndex].data.customerName,
                            email: prodCustomers.customers[customerIndex].data.email,
                            phone: prodCustomers.customers[customerIndex].data.phone,
                            website: prodCustomers.customers[customerIndex].data.website
                        },
                        totalTax: onCalculatePriceHandler('tax'),
                        subtotal: onCalculatePriceHandler('subtotal'),
                        totalDue: onCalculatePriceHandler('totaldue'),
                        products: invoiceProducts
                    }).then(response => {
                        setInvoice({
                            desc: '',
                            customer: 'default',
                            type: 'default',
                            date: null,
                            dueDate: null
                        });
                        setInvoiceProducts([]);
                        setLoading(false);
                        setSave(true);
                        setSaveType('success');
                    }).catch(error => {
                        setLoading(false);
                        setSave(true);
                        setSaveType('error');
                        console.error(error.message);
                    });
                }).catch(error => {
                    setLoading(false);
                    setSave(true);
                    setSaveType('error');
                    console.error(error.message);
                });
        }
    }, [userId, setLoading, edit, invoice, invoiceProducts, match.params.id, onCalculatePriceHandler, prodCustomers.customers]);

    const onInputHandler = useCallback((input, value) => {
        setInvoice(prevState => ({
            ...prevState,
            [input]: value
        }));
    }, []);

    const onCancelHandler = useCallback(() => {
        history.push('/invoices');
    }, [history]);

    return (
        <>
            <SaveResult fire={save} type={saveType} />
            <Header title={edit ? 'Editing invoice' : 'Creating invoice'} />
            <section className={style.content}>
            <div className={style.all_fields}>
                    <div className={style.input_data}>
                        <div className={style.input_data__left}>
                            <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Invoice description</label>
                            <textarea className={inputStyle.textarea} value={invoice.desc} onInput={e => onInputHandler('desc', e.target.value)} />
                        </div>
                        <div className={style.input_data__right}>
                            <div className={style.input_data__sec}>
                                <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Customer</label>
                                <select className={inputStyle.select} value={invoice.customer} onChange={e => onInputHandler('customer', e.target.value)}>
                                    <option disabled value="default">Select customer</option>
                                    {prodCustomers?.customers?.map(customer => (
                                        <option key={customer.id} value={`${customer.data.customerId}___${customer.id}`}>{customer.data.customerName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={style.input_data__sec}>
                                <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Type</label>
                                <select className={inputStyle.select} value={invoice.type} onChange={e => onInputHandler('type', e.target.value)}>
                                    <option disabled value="default">Type</option>
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                            <div className={style.input_data__sec}>
                                <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Date</label>
                                <DatePicker className="date-sec-style" value={invoice.date} changed={onInputHandler} payload="date" />
                            </div>
                            <div className={style.input_data__sec}>
                                <label className={[inputStyle.label, inputStyle.label_required].join(' ')}>Due date</label>
                                <DatePicker className="date-sec-style" value={invoice.dueDate} changed={onInputHandler} payload="dueDate" />
                            </div>
                        </div>
                    </div>
                    <div className={style.all_items}>
                        <h4 className={style.items__title}>
                            <span className={inputStyle.label_required}>Invoiced products</span>
                            <IconButton Icon={AddIcon} onClick={onAddProductHandler}>Add product</IconButton>
                        </h4>
                        <table className={style.table}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Tax</th>
                                    <th>Quantity</th>
                                    <th>Unit price</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceProducts.map((item, index) => {
                                    return (
                                        <Item
                                            key={item.id}
                                            id={item.id}
                                            setItemData={setInvoiceProducts}
                                            productIndex={index} 
                                            deleted={onDeleteProductHandler}
                                            allProds={prodCustomers.products}
                                            curentItemIndex={item?.data ? `${item.data.itemId}___${item.data.itemMainId}` : null}
                                            currentItemTotal={item?.data?.itemTotal}
                                            currentItemQuantity={item?.data?.itemQuantity}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={style.total}>
                        <div className={style.total__sec}>
                            <span>Subtotal</span>
                            <span className={style.total__price}>
                                <CurrencyFormat
                                    value={onCalculatePriceHandler('subtotal')}
                                    displayType={'text'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                            </span>
                        </div>
                        <div className={style.total__sec}>
                            <span>Tax</span>
                            <span className={style.total__price}>
                                <CurrencyFormat
                                    value={onCalculatePriceHandler('tax')}
                                    displayType={'text'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                            </span>
                        </div>
                        <div className={style.total__sec}>
                            <span>Total due</span>
                            <span className={style.total__price}>
                                <CurrencyFormat
                                    value={onCalculatePriceHandler('totaldue')}
                                    displayType={'text'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <div className={style.content__btns}>
                    <Button
                        onClick={onSaveHandler}
                        disabled={onDisablingSubmitHandler()}
                    >
                        Save invoice
                    </Button>
                    <Button onClick={onCancelHandler} secondary>Cancel</Button>
                </div>
            </section>
        </>
    );
};

export default PublishInvoice;