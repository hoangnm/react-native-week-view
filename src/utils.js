import moment from 'moment/min/moment-with-locales';
moment.locale('en');

export const getFormattedDate = (date, format, lang) => {
    moment.locale(lang);
    return moment(date).format(format);
};

export const getCurrentMonth = (date, lang) => {
    moment.locale(lang);
    return moment(date).format('MMMM Y');
};
