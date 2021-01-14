const dateFormat = (ms) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(parseInt(ms));
    let day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    if(day < 10) {
        day = "0" + day;
    }

    return `${day} ${month}, ${year}`;
};

export default dateFormat;