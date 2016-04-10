var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var morgan = require('morgan');
var request = require('request');
var moment = require('moment');
var configDB = require('./public/database/database.js');
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.connect(configDB.url,options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {
  // Wait for the database connection to establish, then start the app.                         
console.log('connected finally');
});
var sendgrid = require("sendgrid")('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');
var email = new sendgrid.Email();
//get the exported MongoDB collection
var User = require('./public/database/user.js');
var MatchList = require('./public/database/MatchList.js');
var PredictionList = require('./public/database/predictionList.js');
var port = process.env.PORT || 8000;
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
moment().format('YYYY MM DD');
//CONNECTING MONGODB SERVER :)
//sending passport and user object to "Passport.js"
require('./public/passport/passport.js')(User,passport,email,sendgrid);


//Middleware setup 
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
// app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'ilovenodedotjs',resave:false,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Routing Start right Hear
app.get('/',nocache,function(req,res){
    if(req.user) {
        res.redirect('/dashboard');
    }
    res.sendFile('html/index.html',{root:__dirname+'/public' });
});

app.post('/saveMatchService',function(req,res){
    console.log(req.body.data);
    var matchData = MatchList();
    matchData.teama = req.body.data.teama;
    matchData.teamb = req.body.data.teamb;
    matchData.save(function(err,matchdata){
        if(err) 
            throw err;
        console.log(matchdata); 
        res.send({status:200,message:'Match Data has been successfully added'});        
    }) 
});

app.get('/getMatchService',function(req,res){
    console.log('getMatchService call from server');
      MatchList.find(function(err,matchList){
    res.send(matchList);
    }).limit(1);       
});
           
app.post('/saveUserPollService',function(req,res){
    console.log('saveUserPollService call from server');
    //firstly we need to check the duplicate data
    var PredictionData = PredictionList();
    PredictionData.predictionValue = req.body.data.userPoll;
    PredictionData.teamName = req.body.data.teamName;
    PredictionData.matchId = 2;
    PredictionData.username = req.user.username;
    PredictionData.save(function(err,predictiondata){
        if(err) 
            throw err;
        console.log(predictiondata); 
        res.send({status:200,message:'Match Data has been successfully added'});        
    })     
});

app.get('/login',function(req,res){
     res.sendFile('html/index.html',{root:__dirname+'/public' });
});

app.get('/signup',function(req,res){
     res.sendFile('html/index.html',{root:__dirname+'/public' });
});

app.get('/aboutme',function(req,res){
     res.sendFile('html/index.html',{root:__dirname+'/public' });
});

app.get('/dashboard',function(req,res){
     res.sendFile('html/index.html',{root:__dirname+'/public' });
});
app.get('/dashboard/home',function(req,res){
     res.sendFile('html/index.html',{root:__dirname+'/public' });
});
app.get('/dashboard/predict',function(req,res){
     res.sendFile('html/index.html',{root:__dirname+'/public' });
});

//this method is called from angular service and it passport will retrn back the  login response
app.post('/login', nocache, function(req,res,next){
    console.log('before');
    passport.authenticate('local-login',function(err,user,info) {
    console.log('authenticate callback');
    if(!user) {return res.send({'status':403,'message':info.message});}
    req.logIn(user,function(err){
        if (err) { return next(err); }
        return res.send({'status':203,'username':user.username});
    });
})(req,res,next);
});

app.post('/signup',nocache, function(req,res,next){
   console.log('in signup service');
   passport.authenticate('local-signup',function(err,user,info){
       console.log('Authorizing callback'); 
       if(!user) {return res.send({'SignupMessage':info.SignupMessage});}
       if(user) {return res.send({'SignupMessage':info.SignupMessage});}
   })(req,res,next); 
});
//------
app.get('/moment',function(req,res){
    var d = new Date();
    console.log(d);
    // res.send(moment("1455049291003", "SSSS").fromNow());
    res.send(moment().toDate());
})

app.get('/logout',nocache, function(req,res) {
    // req.logout();
    console.log('from logout node method');
    if(req.session){
        console.log(req.session);
        req.session.destroy();
        // req.session.auth = null;
        res.clearCookie('auth');
        res.header('Cache-Control', 'no-cache, private, no-store,must-revalidate, max-stale=0, post-check=0, pre-check=0');
    }
    res.send({LogoutMessage:'Successfully Logout'});
    // res.sendFile('homePage.html',{ root: __dirname });    

    
});

//--------------------------------Routes of "Dashboard.html"

app.get('/about',isLoggedIn, function(req,res){
    console.log(req.user);
    res.sendFile('html/dashboard.html',{root:__dirname+'/public' });
});
//route for sending Mail using sendGrid


///verify confiramtion token hear
app.get('/confirmation_token/:mongoid', function(req, res) {
//   res.send('username : ' + req.params.mongoid);
    // console.log(req.params.mongoid);
//   User.findById('req.params.mongoid',function(err,myDoc){
//      res.send(myDoc); 
//   });
  User.findById({'_id':req.params.mongoid},function(err,user){
    //   res.send(user.id);
      if(user.state) {
        //   user already activated
        res.send('User already Activated now close this tab and Login'); 
      } else {
          user.state = true;
          user.save(function(err,user){
            console.log(user);
              res.send('User Activated Successfully Close this tab and login :)');
          });
      }
  });
  
});
// ---------------------------Middleware Definition--------------------------
//Middleware for checking  isLoggedIn
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
        res.expose(req.user, 'user');}
     res.redirect('/');       
}
//Middleware for  nocaching
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}
server.listen(port);
console.log('the magic happens on port'+port);
