import React from 'react';
import style from './Invoices.module.css';
import inputStyle from '../UI/Input/Input.module.css';

//icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';

//components
import Header from '../Header/Header';
import InvoiceRow from './InvoiceRow/InvoiceRow';
import Button from '../UI/Button/Button';
import IconButton from '../UI/IconButton/IconButton';
import DatePicker from '../UI/DatePicker/DatePicker';


const Invoices = () => {
    //invoices origin: invoices/userID/objects
    const invoices = [
        {
            id: 'Oxahdyqjadqiqwdna',
            data: {
                invoiceId: 'I10521-003',
                invoiceDesc: 'Created invoice on app build.',
                customerName: 'Upwork',
                customerId: 'C10521-003',
                invoiceType: 'overdue',
                createdDate: 1609875605298,
                dueDate: 1609875605298,
                totalTax: '3.25',
                totalAmount: '175',
                products: [
                    {
                        itemName: 'Third created item',
                        itemId: 'P10621-003',
                        itemQuantity: '3',
                        itemTax: '1.46',
                        itemPrice: '6.87'
                    }
                ]
            }
        },
        {
            id: 'Nxahdyqjadqiqwdna',
            data: {
                invoiceId: 'I10521-002',
                invoiceType: 'unpaid',
                invoiceDesc: 'Created invoice on app build.',
                createdDate: 1609875605288,
                customerName: 'Freelancer',
                customerId: 'C10521-002',
                totalTax: '7.5',
                totalAmount: '1500',
                dueDate: 1609875605298,
                products: [
                    {
                        itemName: 'Second created item',
                        itemId: 'P10621-002',
                        itemQuantity: '3',
                        itemTax: '1.46',
                        itemPrice: '6.87'
                    }
                ]
            }
        },
        {
            id: 'Cxahdyqjadqiqwdna',
            data: {
                invoiceId: 'I10521-001',
                invoiceType: 'paid',
                invoiceDesc: 'Created invoice on app build.',
                createdDate: 1609875605278,
                customerName: 'A&S Industry',
                customerId: 'C10521-001',
                totalTax: '15',
                totalAmount: '2000',
                dueDate: 1609875605298,
                products: [
                    {
                        itemName: 'First created item',
                        itemId: 'P10621-001',
                        itemQuantity: '3',
                        itemTax: '1.46',
                        itemPrice: '6.87'
                    }
                ]
            }
        }
    ];

    return (
        <>
            <Header title="Invoices" />
            <section className={style.content}>
                <div className={style.header}>
                    <Button>Create invoice</Button>
                </div>
                <div className={style.header}>
                    <div className={style.header__btns}>
                        <IconButton Icon={EditIcon}>Edit</IconButton>
                        <IconButton danger Icon={DeleteIcon}>Delete</IconButton>
                    </div>
                    <div className={style.filter}>
                        <form>
                            <select className={inputStyle.select}>
                                <option value="0">All invoices</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="overdue">Overdue</option>
                            </select>
                            <DatePicker />
                            <button>
                                <SearchIcon />
                            </button>
                        </form>
                    </div>
                </div>
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Date</th>
                            <th>Billed to</th>
                            <th>Tax</th>
                            <th>Total</th>
                            <th>Type</th>
                            <th>Due</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <InvoiceRow key={invoice.id} {...invoice.data} />
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default Invoices;