function checkTodaysId () {
    const date = new Date();
    let year = date.getFullYear();
    const month = date.getMonth() + 1;
    let day = date.getDate();

    year = year - 2000;

    if(day < 10) {
        day = '0' + day;
    }

    return `${month}${day}${year}`;
}

export default function generateTypeId(type, id) {
    //P10621-001
    let date, number;
    const todayId = checkTodaysId();
    if(id) {
        date = id.split('-')[0].replace(type, '');
        number = parseInt(id.split('-')[1]);
        if(date === todayId) {
            let newNumber = parseInt(number) + 1;
            if(newNumber < 10) {
                newNumber = '00' + newNumber
            } else if(newNumber < 100) {
                newNumber = '0' + newNumber
            }
            return `${type}${date}-${newNumber}`;
        } else {
            return `${type}${todayId}-001`;
        }
    } else {
        return `${type}${todayId}-001`;
    }
}