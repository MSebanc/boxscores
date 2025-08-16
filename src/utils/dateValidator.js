const DATE_CONFIG = {
    regex: /^\d{4}-\d{2}-\d{2}$/,
    dateFormat: {
        yearIndex: 0,
        monthIndex: 1,
        dayIndex: 2,
        separator: '-'
    },
    validation: {
        minPadding: 10,
        paddingPrefix: '0'
    }
};

const createDateFromString = (dateString) => new Date(dateString);
const getCurrentDate = () => new Date();
const formatDateComponent = (component) =>
    component < DATE_CONFIG.validation.minPadding
        ? DATE_CONFIG.validation.paddingPrefix + component.toString()
        : component.toString();

const isValidDateFormat = (date) => {
    if (typeof date !== 'string') return false;
    return DATE_CONFIG.regex.test(date);
};

const isDateInFuture = (targetDate, referenceDate = getCurrentDate()) => {
    if (targetDate.getUTCFullYear() > referenceDate.getFullYear()) return true;

    if (targetDate.getFullYear() === referenceDate.getFullYear()) {
        if (targetDate.getUTCMonth() > referenceDate.getMonth()) return true;
        if (targetDate.getUTCMonth() === referenceDate.getMonth() &&
            targetDate.getUTCDate() > referenceDate.getDate()) return true;
    }

    return false;
};

const isValidDateObject = (dateObj) => {
    const timeValue = dateObj.getTime();
    return (timeValue || timeValue === 0) && !isNaN(timeValue);
};

const doesDateMatchOriginalString = (dateObj, originalString) => {
    return dateObj.toISOString().slice(0, 10) === originalString;
};

function isValidDate(date) {
    if (!isValidDateFormat(date)) return false;

    const parsedDate = createDateFromString(date);
    const today = getCurrentDate();

    if (isDateInFuture(parsedDate, today)) return false;
    if (!isValidDateObject(parsedDate)) return false;

    return doesDateMatchOriginalString(parsedDate, date);
}

function getDateStringToday() {
    const date = getCurrentDate();
    const year = date.getFullYear();
    const month = formatDateComponent(date.getMonth() + 1);
    const day = formatDateComponent(date.getDate());

    return `${year}${DATE_CONFIG.dateFormat.separator}${month}${DATE_CONFIG.dateFormat.separator}${day}`;
}

export { isValidDate, getDateStringToday };