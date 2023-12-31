const bcrypt = require('bcryptjs'); //Módulo que va a permitir encriptar la contraseña

const helpers= {}; //Se crea un objeto llamado helpers al cual vamos a relacionar varios métodos

helpers.encryptPassword= async (password) => {
   try {
   const salt= await bcrypt.genSalt(10); //genSalt() usado para generar un hash, la función genSalt() se ejecuta 10 veces
   const finalPassword= await bcrypt.hash(password, salt); //Se le envía el hast salt generado en la linea anterior y se le envía la password que queremos encriptar
   return finalPassword; //Retornamos la contraseña ya encriptada
   } catch (e) {
      console.log(e);
      throw e;
   }
};

helpers.loginPassword= async (password, savePassword) => { //Este método recibe la password de logeo y la savePassword guardada en la base de datos
   try {
    const isMatch= await bcrypt.compare(password, savePassword);
    return isMatch;
   } catch (e) {
    console.log(e)
    throw e;
   }
};
module.exports= helpers;