const {format}= require('timeago.js');

const helpers= {};

helpers.timeago= (date) => {
    return format(date);
};

helpers.eq= (a, b) => {
    return a === b;
}

helpers.formatDate= (date) => {
        const inDate= new Date(date);
        const year = inDate.getFullYear();
        const month = String(inDate.getMonth() + 1).padStart(2, '0');
        const day = String(inDate.getDate()).padStart(2, '0');
  
        // Formato deseado: "yyyy-mm-dd HH:MM:SS"
        const formattedDate = `${year}-${month}-${day}`;
  
        return formattedDate;
};

module.exports= helpers;
//Método utilizado para formatear el tiempo