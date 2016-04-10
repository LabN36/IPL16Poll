var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;

var login = new Schema({
    username: String,
    password: String,
    state : Boolean
},{collection:'loginmodels'});

// var adds = new Schema({
//     name : String,
//     type : String,
//     year : Number   
// },{collection:'adds'});

login.methods.generateHash = function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

login.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',login);
// module.exports = mongoose.model('Adds',adds);
