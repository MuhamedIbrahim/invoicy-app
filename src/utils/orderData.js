export default function orderData(data, type = 'default') {
    let newData = [];
    if(type === 'filter') {
        const defaultData = Object.entries(data.val());
        defaultData.forEach(item => {
            newData.unshift({
                id: item[0],
                data: item[1]
            });
        })
    } else {
        data.forEach(item => {
            newData.unshift({
                id: item.key,
                data: item.val()
            });
        });
    }
    return newData;
}

export function filterData(data1, data2, type, date) {
    let newData = [];
    const firstData = Object.entries(data1.val());
    const secondData = Object.entries(data2.val());
    firstData.forEach(item => {
        if(item[1].createdDate === date && item[1].invoiceType === type) {
            newData.unshift({
                id: item[0],
                data: item[1]
            });
        }
    });
    secondData.forEach(item => {
        if(item[1].createdDate === date && item[1].invoiceType === type) {
            newData.forEach(newItem => {
                if(!newItem.id === item[0]) {
                    newData.unshift({
                        id: item[0],
                        data: item[1]
                    });
                }
            });
        }
    });
    return newData;
}