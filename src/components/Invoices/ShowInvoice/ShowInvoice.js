import React, { useState, useCallback, useEffect } from 'react';
import style from './ShowInvoice.module.css';
import rawStyle from '../PublishInvoice/PublishInvoice.module.css';

//components
import Header from '../../../components/Header/Header';
import Item from '../PublishInvoice/Item/Item';
import IconButton from '../../UI/IconButton/IconButton';
import CurrencyFormat from 'react-currency-format';

//icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

//contexts
import useLoading from '../../../context/loading';
import useAuthContext from '../../../context/auth';

//setup
import db from '../../../firebase-config';

//utils
import dateFormat from '../../../utils/DateFormat';
import AddressFormat from '../../../utils/AddressFormat';

const ShowInvoice = ({match, history}) => {
    //state
    const [invoice, setInvoice] = useState({});
    const [info, setInfo] = useState({});

    //contexts
    const setLoading = useLoading().setLoading;
    const userId = useAuthContext().userId;

    //useEffect
    useEffect(() => {
        setLoading(true);
        db.ref(`invoices/${userId}/${match?.params?.id}`).get()
            .then(invoiceResponse => {
                if(invoiceResponse.val()) {
                    setInvoice(invoiceResponse.val());
                }
                db.ref(`info/${userId}`).get()
                    .then(infoResponse => {
                        if(infoResponse.val()) {
                            setInfo(infoResponse.val());
                        }
                        setLoading(false);
                    }).catch(infoError => {
                        console.error(infoError.message);
                        setLoading(false);
                    })
            }).catch(invoiceError => {
                console.error(invoiceError.message);
                setLoading(false);
            });
    }, [setLoading, match?.params?.id, userId]);

    //callbacks
    const onBackHandler = useCallback(() => {
        history.push('/invoices');
    }, [history]);

    return(
        <>
            <Header title="Showing invoice" />
            <section className={style.content}>
                <IconButton Icon={ChevronLeftIcon} onClick={onBackHandler}>Back to invoices</IconButton>
                <div className={style.invoice}>
                    <div className={style.invoice__header}>
                        <div className={style.header__left}>
                            <h3 className={style.invoice__id}>#Invoice-{invoice?.invoiceId?.replace('I', '')}</h3>
                            <p className={style.invoice__date}>
                                <span>Date:</span> {dateFormat(invoice?.createdDate)}
                            </p>
                            <p className={style.invoice__date}>
                                <span>Due Date:</span> {dateFormat(invoice?.dueDate)}
                            </p>
                            <h4 className={style.invoice__desc_title}>Invoice description</h4>
                            <p className={style.invoice__desc}>{invoice?.invoiceDesc}</p>
                        </div>
                        <div className={style.header__right}>
                            <div className={style.company__logo}>
                                {info?.logo ? <img src={info?.logo} alt="Company logo" /> : null}
                            </div>
                            <p className={style.company__name}>{info?.name}</p>
                            {info?.website ? <p className={style.company__website}>{info?.website}</p> : null}
                            <p className={style.company__detail}><AddressFormat address={info?.address} /></p>
                            <p className={style.company__detail}>{info?.phone}</p>
                            <p className={style.company__detail}>{info?.email}</p>
                        </div>
                    </div>
                    <div className={rawStyle.all_items}>
                        <table className={rawStyle.table}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Tax</th>
                                    <th>Quantity</th>
                                    <th>Unit price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice?.products?.map(item => (
                                    <Item key={item.id} {...item.data} show />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={style.invoice__footer}>
                        <div className={style.invoiced_company}>
                            <h4 className={style.invoiced_company__title}>Invoice to:</h4>
                            <p className={style.company__name}>{invoice?.customer?.customerName}</p>
                            <p className={style.company__website}>{invoice?.customer?.website}</p>
                            <p className={style.company__detail}><AddressFormat address={invoice?.customer?.address} /></p>
                            <p className={style.company__detail}>{invoice?.customer?.phone}</p>
                            <p className={style.company__detail}>{invoice?.customer?.email}</p>
                        </div>
                        <div className={rawStyle.total}>
                            <div className={rawStyle.total__sec}>
                                <span>Subtotal</span>
                                <span className={rawStyle.total__price}>
                                    <CurrencyFormat
                                        value={invoice?.subtotal}
                                        displayType={'text'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                    />
                                </span>
                            </div>
                            <div className={rawStyle.total__sec}>
                                <span>Tax</span>
                                <span className={rawStyle.total__price}>
                                    <CurrencyFormat
                                        value={invoice?.totalTax}
                                        displayType={'text'}
                                        decimalScale={2}
                                        fixedDecimalScale={true}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                    />
                                </span>
                            </div>
                            <div className={rawStyle.total__sec}>
                                <span>Total due</span>
                                <span className={rawStyle.total__price}>
                                    <CurrencyFormat
                                        value={invoice?.totalDue}
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
                </div>
            </section>
        </>
    );
};

export default ShowInvoice;