import React, { useState, useCallback } from 'react';
import style from './Item.module.css';
import inputStyle from '../../../UI/Input/Input.module.css';

//components
import CurrencyFormat from 'react-currency-format';

const Item = React.memo(({show, allProds, id, deleted, setItemData, productIndex, curentItemIndex, currentItemTotal, currentItemQuantity, itemName, itemTax, itemPrice, itemTotal, itemQuantity}) => {
    //state
    const [itemIndex, setItemIndex] = useState(curentItemIndex ? curentItemIndex : 'default');
    const [mainQuantity, setMainQuantity] = useState(currentItemQuantity ? currentItemQuantity : '');
    const [totalPrice, setTotalPrice] = useState(currentItemTotal ? currentItemTotal : 0);

    //callbacks
    const onDeleteItem = useCallback(() => {
        deleted(id);
    }, [deleted, id]);

    const onSaveItemData = useCallback((index, quantity = null) => {
        return {
            itemName: allProds[index].data.itemName,
            itemId: allProds[index].data.itemId,
            itemMainId: allProds[index].id,
            itemTrueId: `${allProds[index].data.itemId}___${allProds[index].id}`,
            itemTax: allProds[index].data.itemTax,
            itemPrice: allProds[index].data.itemPrice,
            itemQuantity: quantity ? quantity : mainQuantity,
            itemFreeTotal: (quantity ? quantity : mainQuantity) * parseFloat(allProds[index].data.itemPrice),
            itemTotal: (quantity ? quantity : mainQuantity) * (parseFloat(allProds[index].data.itemPrice) + parseFloat(allProds[index].data.itemTax))
        }
    }, [allProds, mainQuantity]);

    const onSelectItemHandler = useCallback((index) => {
        const trueIndex = allProds.findIndex(elm => elm.data.itemId === index.split('___')[0] && elm.id === index.split('___')[1]);
        setItemIndex(index);
        setItemData(prevItems => {
            const newItems = prevItems.map(item => Object.assign({}, item));
            const currentItem = newItems[productIndex];
            currentItem.data = onSaveItemData(trueIndex);
            return newItems;
        });
        setTotalPrice(mainQuantity * (parseFloat(allProds[trueIndex].data.itemPrice) + parseFloat(allProds[trueIndex].data.itemTax)));
    }, [setItemData, productIndex, onSaveItemData, mainQuantity, allProds]);

    const onEditQuantityHandler = useCallback((quantity) => {
        const trueIndex = allProds.findIndex(elm => elm.data.itemId === itemIndex.split('___')[0] && elm.id === itemIndex.split('___')[1]);
        setMainQuantity(parseInt(quantity));
        setItemData(prevItems => {
            const newItems = prevItems.map(item => Object.assign({}, item));
            const currentItem = newItems[productIndex];
            currentItem.data = onSaveItemData(trueIndex, parseInt(quantity));
            return newItems;
        });
        setTotalPrice(parseInt(quantity) * (parseFloat(allProds[trueIndex].data.itemPrice) + parseFloat(allProds[trueIndex].data.itemTax)));
    }, [setItemData, productIndex, onSaveItemData, itemIndex, allProds]);

    return (
        <tr className={style.row}>
            <td>
                {show ?
                    itemName
                :
                    <select className={inputStyle.select} value={itemIndex} onChange={e => onSelectItemHandler(e.target.value)}>
                        <option disabled value="default">Select item</option>
                        {allProds?.map(item => (
                            <option key={item.id} value={`${item.data.itemId}___${item.id}`}>{item.data.itemName}</option>
                        ))}
                    </select>
                }
            </td>
            <td>
                <CurrencyFormat
                    value={allProds ? allProds[allProds.findIndex(elm => elm.data.itemId === itemIndex.split('___')[0] && elm.id === itemIndex.split('___')[1])]?.data.itemTax : itemTax}
                    displayType={'text'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    thousandSeparator={true}
                    prefix={'$'}
                />
            </td>
            <td>
                {show ?
                    itemQuantity
                :
                    <input
                        disabled={itemIndex === 'default'}
                        className={inputStyle.input}
                        value={mainQuantity}
                        onInput={e => onEditQuantityHandler(e.target.value)}
                        type="number"
                        min="1"
                    />
                }
            </td>
            <td>
                <CurrencyFormat
                    value={allProds ? allProds[allProds.findIndex(elm => elm.data.itemId === itemIndex.split('___')[0] && elm.id === itemIndex.split('___')[1])]?.data.itemPrice : itemPrice}
                    displayType={'text'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    thousandSeparator={true}
                    prefix={'$'}
                />
            </td>
            <td>
                <CurrencyFormat
                    value={allProds ? itemIndex !== 'default' && totalPrice ? totalPrice : 0 : itemTotal}
                    displayType={'text'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    thousandSeparator={true}
                    prefix={'$'}
                />
            </td>
            {!show &&
            <td className={style.last_cell}>
                <button onClick={onDeleteItem}>Delete item</button>
            </td>
            }
        </tr>
    );
});

export default Item;