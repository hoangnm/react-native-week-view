import moment from 'moment';

export const getFormattedDate = (date, format) => {
    return moment(date).format(format);
};
  
export const getCurrentMonth = (date) => {
    return moment(date).format('MMMM Y');
};