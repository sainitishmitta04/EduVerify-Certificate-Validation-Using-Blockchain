const express = require("express")
const path = require("path")
const multer = require("multer")
const app = express()
var router = express.Router()
var certificate = require("../models/certificate");
var cid = require("../models/cid");

// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")

var from = require('rxjs');


// const Moralis = require("moralis").default;
// const fs = require("fs"); 
    
// // var upload = multer({ dest: "Upload_folder_name" })
// // If you do not want to use diskStorage then uncomment it

var filepath
var filename


    
console.log(filepath)
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
		
		filename = file.originalname
        filepath = __dirname
        filepath = filepath.slice(0,filepath.length-6) +'uploads\\'
		filepath = filepath + filename
    }
  })
       
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 5 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /pdf|docx|/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
// mypic is the name of file attribute
}).single("mypic");       
  
router.get("/admin",function(req,res){
    res.render("admin");
})
    
router.post("/uploadProfilePicture",function (req, res, next) {
	
	var author = {
	  id: req.user._id,
	  username: req.user.username
	}

    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
  		  // var name = req.body.fullname;
		  var srn = req.body.srn;
		  var description =req.body.description;
		  var college = req.body.college;
		  
	 // var link = uploadToIpfs();
		link = uploadToIpfs();
		var m
		link.then(function(result){
			m=result[0]["path"]
		})
  	
		setTimeout(function(){
			var newCertificate = {srn: srn, college: college, author:author,link:m, description: description};
			// Create a new blog and save to DB
			certificate.create(newCertificate, function(err, newlyCreated){
				if(err){
					console.log(err);
				} else {
					//redirect back to blog page
					console.log(newlyCreated);
					// res.redirect("/admin");
				}
			});
			cid.create({cid:m},function(err,cid){
				if(err){
					console.log(err)
				}
				else{
					console.log(cid)
				}
			})
		},5000)
	   
		
        if(err) {
  
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
		//the file needs to be check by the admin so that it will be uploaded 
            res.send(err)
        }
        else {
			
  
            // SUCCESS, image successfully uploaded
            // res.send("Success, File uploaded!")
			setTimeout(function(){
				req.flash("success","File Uploaded Successfully")
				res.redirect("/admin")
			},9000)
  			
        }
    })
})


const Moralis = require("moralis").default;
const fs = require("fs"); 
const { file } = require("locus/src/print")

async function uploadToIpfs() {

    await Moralis.start({
        apiKey: "VARvknrWvNqQ2BD81569VUV0ZOUP3BJxsP1CT7AmWA3A5mHj05ZRU848VI3wZxoT",
    });

    const uploadArray = [
        {
            path: filename,
            content: fs.readFileSync((filepath), {encoding: 'base64'})
        }
    ];

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: uploadArray,
    });

   return(response.result)
}


module.exports = router;
