const {format}= require('timeago.js');

const helpers= {};

helpers.timeago= (date) => {
    return format(date);
};

helpers.eq= (a, b) => {
    return a === b;
}

module.exports= helpers;
//Método utilizado para formatear el tiempo