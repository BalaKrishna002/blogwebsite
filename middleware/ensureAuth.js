
 function ensureAuth(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }else{
      res.redirect("/auth/register");
    }
}

module.exports = ensureAuth;