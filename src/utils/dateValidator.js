function isValidDate(date) {
    if (typeof date !== 'string') return false;
    let regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!date.match(regEx)) return false;
    let curDate = new Date(date);
    let today = new Date();
    if (curDate.getUTCFullYear() > today.getFullYear()) return false;
    if (curDate.getFullYear() === today.getFullYear()) {
        if (curDate.getUTCMonth() > today.getMonth()) return false;
        if (curDate.getUTCMonth() === today.getMonth() && curDate.getUTCDate() > today.getDate()) return false;
    }
    let dNum = curDate.getTime();
    if(!dNum && dNum !== 0) return false;
    if (isNaN(curDate.getTime())) return false;
    return curDate.toISOString().slice(0,10) === date;
}

function getDateStringToday() {
    let date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month.toString();
    }
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day.toString();
    }
    return date.getFullYear() + "-" + month + "-" + day;
}

export { isValidDate, getDateStringToday};