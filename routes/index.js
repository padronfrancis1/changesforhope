// this acts like the Web api where functions that gets the data are being mapped
var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var users = require('../controllers/users_controller.js');
var clients = require('../controllers/clients_controller.js');
var assert = require('assert');
var fs = require('fs');
var mongodb = require('mongodb');


/* employee logic layer */

var multer  = require('multer');
var uri = 'mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope'
// var uri = 'mongodb://localhost:27017/changesforhope';
var assert = require('assert');
var fs = require('fs');
var mongodb = require('mongodb');

// var storage = require('multer-gridfs-storage')({
//    // url: 'mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope'
//    url: 'mongodb://localhost/changesforhope'
// });






var path = require('path');

var storage = require('multer-gridfs-storage')({
  url: 'mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope',
  // url: 'mongodb://localhost/changesforhope',

  // root: 'myfiles',
   filename: function(req, file, cb) {

       crypto.randomBytes(16, function (err, raw) {

           var orgnlFilename = file.originalname;
           var trimmed_orgnlFilename = orgnlFilename.slice(0, -5);
           console.log(trimmed_orgnlFilename);

           cb(err, err ? undefined : trimmed_orgnlFilename);

       });
   },
   metadata: function(req, file, cb) {
      var originalname = file.originalname;

      var trimFileType = originalname.slice(-5);
      
      cb(null, { permission: trimFileType });
   },
   //root: 'fs'
});

var upload = multer({ storage: storage });
var sUpload = upload.single('file');

router.post('/multer', sUpload, function (req, res, next) { 
    res.redirect('/');
});


var mongo = require('mongodb');
var Grid = require('gridfs-stream');
// router.get('/mongoDownload', function(res, req){

  
//   mongo.MongoClient.connect(uri, function(error, db) {

//     var gfs = Grid(db, mongo);

//     gfs.files.findOne({ filename: 'users.js' }, function(err, file){

//       if(err) {
//         console.log(err);
//       } else {
//         console.log(file);
//         console.log(file.contentType);

//         // res.set('Content-Type', file.contentType);
//         // res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

//         var readstream = gfs.createReadStream({
//           _id: file._id
//         });

//         readstream.pipe(res);
        
//       }
//     });

//   });

// });

router.get('/mongoDownload', function(req, res) {

console.log(req.query.fileName);
  mongo.MongoClient.connect(uri, function(error, db) {

    var gfs = Grid(db, mongo);

      gfs.findOne({ filename: req.query.fileName }, function (err, file) {

        if (err) return res.status(400).send(err);
        if (!file) return res.status(404).send('');
        
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
        
        var readstream = gfs.createReadStream({
          _id: file._id
        });
        
        readstream.on("error", function(err) {
          console.log("Got error while processing stream " + err.message);
          res.end();
        });
        
        readstream.pipe(res);

      });


    });

});





router.get('/', function(req, res, next) {

 // res.redirect('/login');

  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

  	res.render('index', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

  	res.render('index', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }

  // if (req.session.user) {

  //   res.render('index', {username: req.session.username, msg: req.session.msg});

  // } else {

  //   req.session.msg = 'Access denied!';

  //   res.redirect('/login');

  // }

});



router.get('/login', function(req, res, next) {


  res.render('login', {msg: req.session.msg});


});


router.get('/logout', users.logoutUser, function(req, res, next) {
  
  console.log("out");
  // router.post('/logout', users.logoutUser);
  req.session.destroy(function(){
      res.redirect('/login');
  });
  
});



router.get('/DownloadUpload', function(req, res, next) {


  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('DownloadUpload', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('index', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }

});


router.get('/DownloadFiles', function(req, res, next) {

  if (req.session.PermissionType == "Staff") {

    res.render('DownloadFiles', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead"){

    res.render('index', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }

});

router.get('/user', function(req, res, next) {
  

  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('user', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('user', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }



});


router.get('/reports', function(req, res, next) {
  
  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('progressReport', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('progressReport', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }

});

router.get('/IncidentReports', function(req, res, next) {
  

  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('incident', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('incident', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }

});



router.get('/signup', function(req, res, next) {


  res.render('signup');



});





// admin logic layer

router.get('/adminPage', function(req, res) {


  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('adminpage', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('index', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }




});

// router.get('/admin/view/client', function(req, res) {


//   if (req.session.username == "admin") {


//     res.render('clientsProfile'); // ejs file

//   } else {

//     req.session.msg = 'Access denied!';

//     res.redirect('/login');

//   }


// });

router.get('/error', function(req, res) {


  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Staff" || req.session.PermissionType == "Team-Lead" ) {


    res.render('login'); // ejs file

  } else {

    res.render('error.ejs');

  }


});

router.get('/success', function(req, res) {


  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Staff" || req.session.PermissionType == "Team-Lead") {


    res.render('login'); // ejs file

  } else {

    res.render('success.ejs');

  }


});


router.get('/addClient', function(req, res) {

  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('adminAddClient', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('index', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }


});

router.get('/clientsProfile', function(req, res, next) {

  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('clientsProfile', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('clientsProfile', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }

}); 

router.get('/reports', function(req, res, next) {
  
  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('progressReport', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('progressReport', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }

});


router.get('/records', function(req, res, next) {

  console.log("records");

  if (req.session.PermissionType == "Admin" || req.session.PermissionType == "Team-Lead") {

    res.render('records', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

  } else if (req.session.PermissionType == "Staff"){

    res.render('records', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

  } else {

    req.session.msg = 'Access denied!';

    res.redirect('/login');
  }

}); 



// router.get('/DownloadFiles', function(req, res, next) {

//   if (req.session.PermissionType == "Admin") {

//     res.render('DownloadFiles', {username: req.session.username, msg: req.session.msg, PermissionType: "Admin" });

//   } else if (req.session.PermissionType == "Staff"){

//     res.render('index', {username: req.session.username, msg: req.session.msg, PermissionType: "Staff" });

//   } else {

//     req.session.msg = 'Access denied!';

//     res.redirect('/login');
//   }

// }); 



router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.post('/logout', users.logoutUser);

router.get('/user/profile', users.getUserProfile); // json source

// router.post('/client/profile', clients.getClientProfile); //
router.post('/view/clientsProfile', clients.GetClientProfile); // working
router.post('/client/update', clients.UpdateClient); // working

router.get('/client/source', clients.ListAllClient); // json source select all 
router.post('/admin/add/client', clients.AddClient);

// Progress Report
//router.post('/employee/client/AddProgressReport', clients.AddProgressReport);
router.post('/AddProgressReport', clients.AddProgressReport);
router.post('/employee/client/ViewProgressReport', clients.ViewProgressReport);
router.post('/employee/client/ViewProgressReportSpecific', clients.ViewProgressReportSpecific);

//Incident Report
router.post('/AddIncidentReport', clients.AddIncidentReport);
router.post('/ViewIncidentReport', clients.ViewIncidentReport);
router.post('/ViewIncidentReportSpecific', clients.ViewIncidentReportSpecific);

router.post('/employee/view/timeLogs', users.ViewTimeLogs);
router.post('/employee/view/empInfo', users.SearchEmpInfo);
router.post('/checkUserName', users.checkUserName);

// router.post('/multer', users.UploadFiles);
//router.post('/download', users.DownloadFile);
//router.post('/mongoDownload', users.DownloadFiles);
router.get('/adminFiles', users.ListAdminFiles);
router.get('/staffFiles', users.ListStaffFiles);
router.get('/SqlConnect', users.SqlConnect);
// router.get('/SearchFiles', users.SearchFile);

router.post('/getStaffLogs', users.getStaffLogs);
router.post('/getAllStaffLogs', users.getAllStaffLogs);

module.exports = router;
