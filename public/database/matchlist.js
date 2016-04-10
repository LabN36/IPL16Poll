var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;


//,{collection:'addsfinals'}
var MatchList = new Schema({
    teama : {type:String, required: true},
    teamb : {type:String, required: true},
    venue : {type:String, required: false},
    date : {type:Date, required: false}
});
    

module.exports = mongoose.model('MatchList',MatchList);