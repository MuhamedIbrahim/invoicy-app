import React, { useCallback } from 'react';
import CurrencyFormat from 'react-currency-format';
import dateFormat from '../../../utils/DateFormat';
import style from '../../Invoices/InvoiceRow/InvoiceRow.module.css';

const TypeRow = React.memo(({history, selected, id, currentType, itemName, itemPrice, itemTax, customerName, website, phone, email, invoiceId, createdDate, customer, totalTax, totalDue, invoiceType, dueDate}) => {
    //callbacks
    const onSelectElement = useCallback((e) => {
        if(e.target.checked) {
            selected(prevState => {
                if(prevState?.findIndex(elm => elm === id) === -1) {
                    return [...prevState, id];
                }
            });
        } else {
            selected(prevState => (
                prevState?.filter(elm => elm !== id)
            ));
        }
    }, [id, selected]);

    const onShowInvoiceHandler = useCallback(() => {
        history?.push(`/invoices/show${id}`);
    }, [history, id]);

    let content = null;
    if(currentType === 'products') {
        content = (
            <tr className={style.row}>
                <td>
                    <input type="checkbox" onChange={e => onSelectElement(e)} />
                    {itemName}
                </td>
                <td>
                    <CurrencyFormat
                        value={itemPrice}
                        displayType={'text'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={true}
                        prefix={'$'}
                    />
                </td>
                <td>
                    <CurrencyFormat
                        value={itemTax}
                        displayType={'text'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={true}
                        prefix={'$'}
                    />
                </td>
            </tr>
        );
    } else if(currentType === 'customers') {
        content = (
            <tr className={style.row}>
                <td>
                    <input type="checkbox" onChange={e => onSelectElement(e)} />
                    {customerName}
                </td>
                <td className={[style.website, style.not_captial].join(' ')}>{website ? website : <strong>-</strong>}</td>
                <td>{phone}</td>
                <td className={[style.email, style.not_captial].join(' ')}>{email}</td>
            </tr>
        );
    } else if(currentType === 'invoices') {
        content = (
            <tr className={style.row}>
                <td>
                    <input type="checkbox" onChange={e => onSelectElement(e)} />
                    {invoiceId?.replace('I', '')}
                </td>
                <td>{dateFormat(createdDate)}</td>
                <td>{customer?.customerName}</td>
                <td>
                    <CurrencyFormat
                        value={totalTax}
                        displayType={'text'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={true}
                        prefix={'$'}
                    />
                </td>
                <td>
                    <CurrencyFormat
                        value={totalDue}
                        displayType={'text'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={true}
                        prefix={'$'}
                    />
                </td>
                <td>{invoiceType}</td>
                <td>{dateFormat(dueDate)}</td>
                <td className={style.cell_nondata}>
                    <button onClick={onShowInvoiceHandler}>Show invoice</button>
                </td>
            </tr>
        );
    }

    return (
        <>
            {content}
            <tr className={style.row_separate}></tr>   
        </>
    );
});

export default TypeRow;