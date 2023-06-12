function validarContrasena(contrasena1, contrasena2) {
    var contrasena1 = contrasena1;
    var contrasena2 = contrasena2
    if (contrasena1 === contrasena2) {
      // Las contraseñas coinciden
      return true;
    } else {
      // Las contraseñas no coinciden
      return false;
    }
  }

function validarTipoUsuario(typeUser){
var typeUser= typeUser;

if(typeUser === "EXPONENT"){
  return true;
} else {
  return false;
}
};


  module.exports= {validarContrasena, validarTipoUsuario};