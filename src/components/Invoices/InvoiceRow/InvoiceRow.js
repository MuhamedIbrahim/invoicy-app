import React from 'react';
import CurrencyFormat from 'react-currency-format';
import dateFormat from '../../../utils/DateFormat';
import style from './InvoiceRow.module.css';

const InvoiceRow = props => {
    return (
        <>
            <tr className={style.row}>
                <td>
                    <input type="checkbox" />
                    {props.invoiceId.replace('I', '')}
                </td>
                <td>{dateFormat(props.createdDate)}</td>
                <td>{props.customerName}</td>
                <td>
                    <CurrencyFormat
                        value={props.totalTax}
                        displayType={'text'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={true}
                        prefix={'$'}
                    />
                </td>
                <td>
                    <CurrencyFormat
                        value={props.totalAmount}
                        displayType={'text'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={true}
                        prefix={'$'}
                    />
                </td>
                <td>{props.invoiceType}</td>
                <td>{dateFormat(props.dueDate)}</td>
                <td className={style.cell_nondata}>
                    <button>Show invoice</button>
                </td>
            </tr>
            <tr className={style.row_separate}></tr>
        </>
    );
};

export default InvoiceRow;