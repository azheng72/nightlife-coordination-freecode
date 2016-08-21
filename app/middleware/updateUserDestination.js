var User=require("../model/users");

module.exports=function(req,res,next){
    console.log(req.body);
    User.findOne({user:{name:'Zheng Liang', id: req.params.user}},function(err,user){
        console.log(user);
        if (err) { console.log(err),res.end();};
        if(user){
            user.yelp=req.body.yelp;
            user.save(function (err) {  
            			    if (err) {throw err;}
        			        console.log("user update success");
                            next();
                        });
        }
        else{
            res.end();
        }
    });
}