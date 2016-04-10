var LocalStategy = require('passport-local').Strategy;
// var User = require('../dataBase/user.js');

module.exports = function(User,passport,email,sendgrid) {
    
     passport.serializeUser(function(user, done) {
         console.log("Serializing"+user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("Deserializing");
        User.findById(id, function(err, user) {
            done(err, user);
            console.log(user.username);
        });
    });
// Passport method for Authenticating user ie. login
passport.use('local-login',new LocalStategy({
    usernameField:'username',
    passwordField:'password'
    // passReqToCallback : true
},function(username,password,done) {
    process.nextTick(function () {
         console.log("localstrategy ---");
        User.findOne({'username':username},function(err,user) {
        // var user = {username: 'Rishabh', password: 'Agrawal'};
            // return done(null, user); 
            if(err)
                return done(err);
            if(user != null && !user.state  )    {
                return done(null,false,{message:'Please verify you email'});
            }
            else if(!user) 
               { return done(null,false,{message:'you are not in my MongoDB, singup Please!'}); }
            else if(!user.validPassword(password))
               { return done(null,false,{message:'you entered password is wrong'}); }
            return done(null,user);
            });
      });
    }));
// Passport method for Authorizing user ie. signup
passport.use('local-signup',new LocalStategy({
    usernameField : 'username',
    passwordField : 'password'
},function(username,password,done) {
    process.nextTick(function() {
        console.log("signUp Strategy ---");
        User.findOne({'username' : username }, function(err,user){
            if(err)
                return done(err);
            if(user) {
                return done(null,false,{SignupMessage:'This email is already taken.'})
            } else {
                var newUser = new User();
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.state = false;
                newUser.save(function(err,user){
                    if(err)
                        throw err;
                     console.log(user.id);   
                     console.log("inside sendgrid Method");
                     email.addTo(username);
                     email.setFrom("no-reply@ProjectX.com");
                     email.setSubject("ProjectX: user Activation");
                     email.setHtml("<p>click hear for user activation</p><a href="+"http://localhost:8000/confirmation_token/"+user.id+">Activate</a>");
                     sendgrid.send(email);
                     return done(null,user,{SignupMessage : 'check your email for confirmation link'});
      
                })
            }    
        });    
    });    
}))

}