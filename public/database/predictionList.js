var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;


//,{collection:'addsfinals'}
var PredictionList = new Schema({
    teamName : {type:String, required: true},
    predictionValue : {type:Number, required: true},
    username : {type:String, required: true},
    matchId : {type:Number, required: true}
});
    

module.exports = mongoose.model('PredictionList',PredictionList);