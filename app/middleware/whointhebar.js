var User=require("../model/users");
var async=require("async");
var requestYelp=require(process.cwd()+'/app/factory/yelp');
// yelp api return formate:
// {
//     ...
//     businesses:[
//         {   ...
//             id:...
//             name:...
//         },
//         {   ...
//             id:...
//             name:...
//         }
//     ]
// }
// modify formate:
// {
//     ...
//     businesses:[
//         {   ...
//             id:...
//             name:...
//             customers:[]
//         },
//         {   ...
//             id:...
//             name:...
//             customers:[]
//         }
//     ]
//     customers:[
//     ]
// }

module.exports=function(req,res,next){

    
    requestYelp({location: req.query.destination},function(err,response,body){
        if(err || response.statusCode !== 200){
            console.error("Error: "+err+" Response-statusCode: "+response.statusCode +" Response: "+body); 
            res.send(body);
            return res.end();
        }
        var bars=JSON.parse(body);
        bars.customers=[];
        
        function iteration(bar,idx,callback){
            bar.customers=[];
            var strategy={
            yelp:{
                    id:bar.id,
                    name:bar.name
                }
            };
            User.find(strategy,function(err,users){
                if (err) { console.log(err);return callback(err); }
                if(users && users.length!==0) {
                    bars.customers=bars.customers.concat(users);
                    bar.customers=users;
                }
                callback();
            });
        }
        
        function finish(err){
            if(err) console.log(err);
            res.send(bars);
            next();
        }
        
        if(bars.hasOwnProperty('businesses')) {
            async.forEachOf(bars.businesses,iteration,finish);
        }
        else{
            res.end();
        }
    });
};