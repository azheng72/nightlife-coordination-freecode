var path = process.cwd();
var updateUserDestination=require(process.cwd()+'/app/middleware/updateUserDestination');
var requestYelp=require(process.cwd()+'/app/factory/yelp');
var whoInTheBar=require(path+'/app/middleware/whointhebar');
var isLoggedIn=require(path+'/app/middleware/isloggedin');
var express = require('express');
var bodyParser = require('body-parser');
var passport=require("passport");
var session = require('express-session');
var mongoose = require('mongoose');
require('dotenv').load();

var app = express();

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);

app.use('/client',express.static(path +'/client'));
app.use('/node_modules',express.static(path+'/node_modules'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
	secret: 'secretNightlife',
	resave: false,
	saveUninitialized: true
}));
require('./app/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());



app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' }));

app.route('/')
  .get(function(req,res){
    res.sendFile(path + '/client/index.html');
  });
  

app.route('/search')  //normal search for not login, will not show customers
  .get(
      function(req,res){
        requestYelp({location: req.query.destination},function(err,response,body){
          if(err || response.statusCode !== 200){
              console.error("Error: "+err+" Response-statusCode: "+response.statusCode +" Response: "+body); 
              res.end();
          }
          res.send(body);
          res.end();
        });
      }
  );
  
app.route('/search/:user')  //search for login, will show customers //:user is facebook userid
  .get(isLoggedIn,whoInTheBar,
    function(req,res){
      res.end();
    }
  );
  
app.route('/login')
  .get(isLoggedIn,
    function(req,res){
      res.send(req.user);  //passport will save user info to req.user object when successfully login in
      res.end();
    }
  );
  
app.route('/logout')
  .get(
    function(req,res){
      req.logout();
      res.redirect('/');
    }
  );
  
app.route('/update/:user') //:user is facebook userid
  .put(isLoggedIn,updateUserDestination,
    function(req,res){
      res.end();
    }
  );
  
  
var port=process.env.PORT || 8080;
var server=app.listen(port,function(){
  console.log('Node.js listening on port ' + port + '...');
  // console.log(server.address());
});