    
    module.exports=function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} 
		else {
	        res.status('401');//not authorized
	        res.end();
		}
	}