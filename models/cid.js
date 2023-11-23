var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var cid = new mongoose.Schema({
    cid: String
});

module.exports = mongoose.model("cid", cid);