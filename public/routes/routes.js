module.exports = function(app,passport,__dirname) {
    __dirname = __dirname+'/public/htmlPage';
      var AddList = require('../dataBase/add');
app.get('/',nocache,function(req,res){
    
    console.log(__dirname);
    console.log('../'+__dirname);
    if(req.user){
        res.redirect('/myProfile');
    } else{
    res.sendFile('./homePageBeta.html',{ root: __dirname });
    }    
});
//Login GET
// app.get('/login',function(req,res){
//     res.sendFile('login.html',{ root: __dirname });    
// });
//Login POST
app.post('/login',passport.authenticate('local-login',{
     successRedirect : '/myProfile',
        failureRedirect : '/',
        failureFlash : true
}));
//check for authentication before hitting the 'URL'
// if passed successfully then redrect to Dashboard else homePage
app.get('/myProfile', isLoggedIn, nocache, function(req,res){
    console.log('session Id'+req.sessionID);
    console.log('cookie expiry'+req.session.cookie.expires);
    console.log('other data'+req.session);
    console.log(req.user);
    res.sendFile('myProfileBeta.html',{ root: __dirname });    
});
//write logic for logout methods
app.get('/logout',function(req,res){
    // req.logout();
    if(req.session){
        console.log(req.session);
        req.session.destroy();
        // req.session.auth = null;
        res.clearCookie('auth');
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        
    }
    res.send('Successfully Logout');
    // res.sendFile('homePage.html',{ root: __dirname });    
});



//to get all the Add resides in mongoDB
app.get('/adds',function(req,res){
    // console.log(AddList.find());
    AddList.find(function(err,adds){
        console.log(adds);
        res.send(adds);
    })
    
});
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    
    if(req.isAuthenticated())
        return next();
            
     res.redirect('/');       
}
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

}