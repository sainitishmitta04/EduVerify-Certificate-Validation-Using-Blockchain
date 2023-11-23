var mongoose = require("mongoose");

var certificate = new mongoose.Schema({
   // name: String,
   srn: String,
   college: String,
   description: String,
   link: [{
	   type: String
   }],
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   cid: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "cid"
      }
   ]
});

module.exports = mongoose.model("certificate", certificate);