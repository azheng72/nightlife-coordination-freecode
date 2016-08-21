var FacebookStrategy = require('passport-facebook').Strategy
  , User=require(process.cwd()+'/app/model/users');
  
module.exports=function(passport){

	passport.serializeUser(function (user, done) {
		//console.log('serializedUser: '+ user);
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			//console.log('deserializedUser: '+id);
			done(err, user);
		});
	});
	
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:  "https://nightlife-coordination-freecode-azheng72.c9users.io/auth/facebook/callback" //process.env.URL + '/auth/facebook/callback' ||
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne({user:profile['_json']}, function(err, user) {
            if (err) { return done(err); }
            if (user) {
    			return done(null, user);
    		} 
    		else {
    			var newUser = new User();
    
    			newUser.user.id = profile['_json'].id;
    			newUser.user.name = profile['_json'].name;
                newUser.yelp.name ="";
                newUser.yelp.id ="";
    			newUser.save(function (err) {
    				if (err) {
    					throw err;
    				}
    
    				return done(null, newUser);
    			});  
    		}
          
        });
      }
    ));

}

// Facebook Oath return formate
// { id: '',
//   username: undefined,
//   displayName: '',
//   name: 
//   { familyName: undefined,
//      givenName: undefined,
//      middleName: undefined },
//   gender: undefined,
//   profileUrl: undefined,
//   provider: 'facebook',
//   _raw: '{"name":"","id":""}',
//   _json: { name: '', id: '' } }