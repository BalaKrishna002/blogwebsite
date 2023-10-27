
 function ensureAuth(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }else{
      res.redirect("/auth/login");
    }
}

module.exports = ensureAuth;