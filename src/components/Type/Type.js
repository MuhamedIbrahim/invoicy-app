import React, { useState, useEffect, useCallback, useMemo } from 'react';
import inputStyle from '../UI/Input/Input.module.css';
import style from './Type.module.css';

//icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

//components
import Header from '../Header/Header';
import Button from '../UI/Button/Button';
import IconButton from '../UI/IconButton/IconButton';
import TypeRow from './TypeRow/TypeRow';
import DatePicker from '../UI/DatePicker/DatePicker';
import Modal from '../UI/Modal/Modal';

//contexts
import useLoading from '../../context/loading';
import useAuthContext from '../../context/auth';

//utils
import orderData, { filterData } from '../../utils/orderData';
import dateFormat from '../../utils/DateFormat';

//setup
import db from '../../firebase-config';

const Type = ({history, match}) => {
    //state
    const [typeData, setTypeData] = useState([]);
    const [selectedType, setSelectedType] = useState([]);
    const [filterType, setFilterType] = useState('default');
    const [filterDate, setFilterDate] = useState(null);
    const [filterState, setFilterState] = useState('');
    const [deleteCheck, setDeleteCheck] = useState(false);

    //contexts
    const setLoading = useLoading().setLoading;
    const userId = useAuthContext().userId;

    //currentType string
    const currentType = useMemo(() => match.path.split('/')[1], [match.path]);

    const fetchDataHandler = useCallback((offFilter = false) => {
        setLoading(true);
        db.ref(`${currentType}/${userId}`).get()
            .then(response => {
                if(response.val()) {
                    setTypeData(orderData(response));
                } else {
                    setTypeData([]);
                }
                if(offFilter) {
                    setFilterType('default');
                    setFilterDate(null);
                    setFilterState('');
                }
                setLoading(false);
            }).catch(error => {
                setLoading(false);
                console.error(error.message);
            });
    }, [currentType, setLoading, userId]);

    //effects
    useEffect(() => {
        setSelectedType([]);
        fetchDataHandler();
    }, [fetchDataHandler]);

    //callbacks
    const onDeleteHandler = useCallback(() => {
        setLoading(true);
        const deletedElments = {};
        selectedType?.forEach(item => {
            deletedElments['/' + item] = null;
        });
        db.ref(`${currentType}/${userId}`).update(deletedElments)
            .then(response => {
                let prevElements = typeData.map(elm => Object.assign({}, {id: elm.id, data: Object.assign({}, elm.data)}));
                setTypeData(prevElements.filter(prevElm => !selectedType?.includes(prevElm.id)));
                setSelectedType([]);
                setDeleteCheck(false);
                setLoading(false);
            }).catch(error => {
                setDeleteCheck(false);
                setLoading(false);
                console.error(error.message);
            });
    }, [currentType, selectedType, typeData, setLoading, userId]);

    const onEditHandler = useCallback(() => {
        history.push(`/${currentType}/edit${selectedType[0]}`);
    }, [selectedType, currentType, history]);

    const onCreateHandler = useCallback(() => {
        history.push(`/${currentType}/create-${currentType.slice(0, -1)}`);
    }, [currentType, history]);

    const onSubmitFilterHandler = useCallback(() => {
        setLoading(true);
        if(filterType !== 'default' && filterDate !== null) {
            const dateMs = new Date(filterDate).getTime();
            db.ref(`invoices/${userId}`).orderByChild('invoiceType').equalTo(filterType).get()
                .then(typeResponse => {
                    db.ref(`invoices/${userId}`).orderByChild('createdDate').equalTo(dateMs).get()
                        .then(dateResponse => {
                            if(typeResponse.val() && dateResponse.val()) {
                                setTypeData(filterData(typeResponse, dateResponse, filterType, dateMs));
                            } else {
                                setTypeData([]);
                            }
                            setFilterState(`Viewing invoices of type ${filterType} and created on ${dateFormat(dateMs)}`);
                            setLoading(false);
                        }).catch(dateError => {
                            setLoading(false);
                            console.error(dateError.message);
                        });
                }).catch(typeError => {
                        setLoading(false);
                        console.error(typeError.message);
                });
        } else if(filterType !== 'default') {
            db.ref(`invoices/${userId}`).orderByChild('invoiceType').equalTo(filterType).get()
                .then(response => {
                    if(response.val()) {
                        setTypeData(orderData(response, 'filter'));
                    } else {
                        setTypeData([]);
                    }
                    setFilterState(`Viewing invoices of type ${filterType}`);
                    setLoading(false);
                }).catch(error => {
                    setLoading(false);
                    console.error(error.message);
                });
        } else if(filterDate !== null) {
            const dateMs = new Date(filterDate).getTime();
            db.ref(`invoices/${userId}`).orderByChild('createdDate').equalTo(dateMs).get()
                .then(response => {
                    if(response.val()) {
                        setTypeData(orderData(response, 'filter'));
                    } else {
                        setTypeData([]);
                    }
                    setFilterState(`Viewing invoices created on ${dateFormat(dateMs)}`);
                    setLoading(false);
                }).catch(error => {
                    setLoading(false);
                    console.error(error.message);
                });
        }
    }, [filterType, filterDate, setLoading, userId]);

    const onRemoveFilterHandler = useCallback(() => {
        fetchDataHandler(true);
    }, [fetchDataHandler]);

    const tableHeaders = useCallback(() => {
        if(currentType === 'customers') {
            return (
                <>
                    <th>Name</th>
                    <th>Website</th>
                    <th>Phone</th>
                    <th>Email Address</th>
                </>
            );
        } else if(currentType === 'products') {
            return (
                <>
                    <th>Name</th>
                    <th>Unit price</th>
                    <th>Unit tax</th>
                </>
            );
        } else if(currentType === 'invoices') {
            return (
                <>
                    <th>No</th>
                    <th>Date</th>
                    <th>Billed to</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Type</th>
                    <th>Due</th>
                    <th></th>
                </>
            );
        }
    }, [currentType]);

    return (
        <>
            {deleteCheck &&
            <Modal>
                <p>
                    {currentType === 'products' || currentType === 'customers' ?
                        `Deleting ${currentType} will affect old invoices including these ${currentType} when you edit them.`
                    :
                        `Are you sure you want to delte these ${currentType}.`
                    }
                </p>
                <Button onClick={onDeleteHandler} danger>Delete</Button>
                <Button onClick={() => setDeleteCheck(false)} secondary>Cancel</Button>
            </Modal>
            }
            <Header title={currentType} />
            <section className={style.content}>
                <div className={style.header}>
                    <Button onClick={onCreateHandler}>Create {currentType.slice(0, -1)}</Button>
                </div>
                <div className={style.header}>
                    <div className={style.header__btns}>
                        <IconButton
                            disabled={selectedType.length === 0 || selectedType?.length > 1}
                            Icon={EditIcon}
                            onClick={onEditHandler}
                        >
                            Edit
                        </IconButton>
                        <IconButton
                            disabled={selectedType?.length === 0}
                            danger
                            Icon={DeleteIcon}
                            onClick={() => setDeleteCheck(true)}
                        >
                            Delete
                        </IconButton>
                    </div>
                    {currentType === 'invoices' &&
                        <div className={style.filter}>
                            <select className={inputStyle.select} value={filterType} onChange={e => setFilterType(e.target.value)}>
                                <option value="default" disabled>All invoices</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="overdue">Overdue</option>
                            </select>
                            <DatePicker value={filterDate} changed={setFilterDate} />
                            <button disabled={!filterDate && filterType === 'default'} onClick={onSubmitFilterHandler}>
                                <SearchIcon />
                            </button>
                            {filterState && <button className={style.close} onClick={onRemoveFilterHandler}>
                                    <CloseIcon />
                                </button>
                            }
                        </div>
                    }
                </div>
                {filterState && <h4 className={style.filter_title}>{filterState}</h4>}
                {typeData?.length > 0 ?
                    <table className={style.table}>
                        <thead>
                            <tr>
                                {tableHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {typeData.map(elm => (
                                <TypeRow history={history} currentType={currentType} key={elm.id} id={elm.id} {...elm.data} selected={setSelectedType}/>
                            ))}
                        </tbody>
                    </table>
                :
                    <h2 className={style.empty_content}>
                        {filterState ?
                            `No ${currentType} found.`
                        :    
                            `Looks like ${currentType} section is empty, create one now.`
                        }
                    </h2>
                }
            </section>
        </>
    );
};

export default Type;