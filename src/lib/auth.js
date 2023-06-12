module.exports= {

    isLoggedIn(req, res, next) { 
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },
    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');
    },
    isAdmin(req, res, next) {
    if (req.user && req.user.typeUser === 'ADMIN') {
      // Si el usuario es un administrador, permite el acceso a la ruta
      return next();
    } else {
      // Si el usuario no es un administrador, redirige a una página de error o muestra un mensaje de acceso denegado
      res.redirect('/profile');
    }
    },
    isExponent(req, res, next) {
    if (req.user && req.user.typeUser === 'EXPONENT') {
      // Si el usuario es un exponente, permite el acceso a la ruta
      return next();
    } else {
      // Si el usuario no es un exponente, redirige a una página de error o muestra un mensaje de acceso denegado
      res.redirect('/profile');
    }
    },
    isExpert(req, res, next) {
    if (req.user && req.user.typeUser === 'EXPERT') {
      // Si el usuario es un experto, permite el acceso a la ruta
      return next();
    } else {
      // Si el usuario no es un experto, redirige a una página de error o muestra un mensaje de acceso denegado
      res.redirect('/profile');
    }
    },
    isRevoked(req, res, next) {
      if (req.user && req.user.typeUser === 'REVOKED') {
        // Si el usuario es un experto, permite el acceso a la ruta
        return next();
      } else {
        // Si el usuario no es un experto, redirige a una página de error o muestra un mensaje de acceso denegado
        res.redirect('/profile');
      }
      }
};

//Método utilizado para proteger las ruta