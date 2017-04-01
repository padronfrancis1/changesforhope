// this acts like the common.cs where data are being pulled and pushed
var crypto = require('crypto');
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Files = mongoose.model('fs.files'),
	UserTimeLogs = mongoose.model('UserTimeLogs');

var mongo = require('mongodb');
var Grid = require('gridfs-stream');

// exports.DownloadFile = function(req, res) {
// 	console.log("API REACHED");




// };

// exports.DownloadFiles = function(req, res) {

// console.log(req.body.fileName);

//   mongo.MongoClient.connect(uri, function(error, db) {

//     var gfs = Grid(db, mongo);

//       gfs.findOne({ filename: req.body.fileName }, function (err, file) {

//         if (err) return res.status(400).send(err);
//         if (!file) return res.status(404).send('');
        
//         res.set('Content-Type', file.contentType);
//         res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
        
//         var readstream = gfs.createReadStream({
//           _id: file._id
//         });
        
//         readstream.on("error", function(err) {
//           console.log("Got error while processing stream " + err.message);
//           res.end();
//         });
        
//         readstream.pipe(res);

//       });


//     });


// };


var moment = require('moment');

function hashPW(pwd) {
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

exports.checkUserName = function(req, res) {
	console.log(req.body.username)
	User.findOne({ username: req.body.username }).exec(function(err, user)
	{
		if(user)
		{
			res.json(user);
		} else
		{
			console.log("User does not exist");
		}
	});
};

exports.signup = function(req, res) {

	var user = new User(mongoose.model('User'));

	user.set('username', req.body.username);
	user.set('hashed_password', hashPW(req.body.password));
	user.set('FirstName', req.body.firstname);
	user.set('MiddleName', req.body.middlename);
	user.set('LastName', req.body.lastname);
	user.set('PhoneNumber', req.body.phonenumber);
	user.set('Address', req.body.address);
	user.set('PermissionType', req.body.permission);
	user.set('email', req.body.email);

	console.log(req.body.permission);

	user.save(function(err){

		if(err) {

			res.session.error = err;
			res.render('error');

		} else {

			req.session.user = user.id;
			req.session.username = user.username;
			req.session.msg = 'Authenticated as ' + user.PermissionType;

			req.session.destroy(function(){
		  		res.redirect('success');
		  	});
		}
	});

	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(user) {

			console.log("User Name already taken");
			
			res.render('/signup');

		} else {


			
		}

	});

};


exports.login = function(req, res) {

	// if( req.body.username == "admin") {
	// 	admin(req, res);
	// } else {
	// 	user(req, res);
	// }

	var date = new Date();

	var currentDate = moment(date).format('M/D/YYYY');
	var currentDateTime = moment(date).format('M/D/YYYY-HH:mm:ss');
	var currentTime = moment(date).format('h:mm:ss a');

	var currentMonth = moment(date).format('M');
	var currentYear = moment(date).format('YYYY');

	
	console.log("This is the data" + currentDateTime);

	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {

			var timeIn = new User(mongoose.model('User'));
			timeIn.set('username', req.body.username)
			timeIn.set('email', user.email);
			timeIn.set('CurrentDate', currentDate);
			timeIn.set('Year', currentYear);
			timeIn.set('Month', currentMonth);
			timeIn.set('TimeIn', currentDateTime);
			timeIn.set('TimeOut', "NULL");
			timeIn.set('CurrentDateTime', currentDateTime);


			timeIn.save(function(err){

				if(err) {

					console.log("error");

				} else {
					console.log("inserted");
					console.log(user.username);
					console.log(user.email);
					console.log(currentDate);
					console.log(currentMonth);
					console.log(currentYear);
					console.log(currentTime);
					console.log(currentDateTime);
					
				}
			});


			if( user.PermissionType == "Admin") {

					req.session.regenerate(function() {
					
					req.session.user = user.id;
					req.session.username = user.username;
					req.session.email = user.email;
					req.session.PermissionType = user.PermissionType;
					req.session.msg = 'Authenticated as ' + user.PermissionType;

					// res.redirect('/');
					res.redirect('/adminPage');
				});
			} else {
					req.session.regenerate(function() {
						
					req.session.user = user.id;
					req.session.username = user.username;
					req.session.email = user.email;
					req.session.PermissionType = user.PermissionType;
					req.session.msg = 'Authenticated as ' + user.PermissionType;

					// res.redirect('/');
					res.redirect('/');
				});
			}
			


		} else {

			err = 'Authentication failed.';

		}
		if(err) {

			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect('/login');
			});

		}
	});


};

function admin(req, res) {

	var date = new Date();

	var currentDate = moment(date).format('M/D/YYYY');
	var currentDateTime = moment(date).format('M/D/YYYY-HH:mm:ss');
	var currentTime = moment(date).format('h:mm:ss a');

	var currentMonth = moment(date).format('M');
	var currentYear = moment(date).format('YYYY');

	


	// 		console.log("You have an admin account");
	// 		console.log(user.username);
	// 		console.log(user.email);
	// 		console.log(currentDate);
	// 		console.log(currentMonth);
	// 		console.log(currentYear);
	// 		console.log(currentTime);
	console.log("This is the data" + currentDateTime);

	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {

			var timeIn = new User(mongoose.model('User'));
			timeIn.set('username', req.body.username)
			timeIn.set('email', user.email);
			timeIn.set('CurrentDate', currentDate);
			timeIn.set('Year', currentYear);
			timeIn.set('Month', currentMonth);
			timeIn.set('TimeIn', currentDateTime);
			timeIn.set('TimeOut', "NULL");
			timeIn.set('CurrentDateTime', currentDateTime);


			timeIn.save(function(err){

				if(err) {

					console.log("error");

				} else {
					console.log("inserted");
					console.log(user.username);
					console.log(user.email);
					console.log(currentDate);
					console.log(currentMonth);
					console.log(currentYear);
					console.log(currentTime);
					console.log(currentDateTime);
					
				}
			});

			req.session.regenerate(function(){
				
				req.session.user = user.id;
				req.session.username = user.username;
				req.session.email = user.email;
				req.session.PermissionType = user.PermissionType;
				req.session.msg = 'Authenticated as ' + user.username;

				// res.redirect('/');
				res.redirect('/adminPage');
			});


		} else {

			err = 'Authentication failed.';

		}
		if(err) {

			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect('/login');
			});

		}
	});
}

// login
var user = function(req, res) {

	var date = new Date();

	var currentDate = moment(date).format('M/D/YYYY');
	var currentDateTime = moment(date).format('M/D/YYYY-HH:mm:ss');
	var currentTime = moment(date).format('h:mm:ss a');

	var currentMonth = moment(date).format('M');
	var currentYear = moment(date).format('YYYY');


	User.findOne({ username: req.body.username }).exec(function(err, user) {

		if(!user) {

			err = 'User not found.';

		} else if (user.hashed_password === hashPW(req.body.password.toString())) {

			var timeIn = new User(mongoose.model('User'));
			timeIn.set('username', req.body.username)
			timeIn.set('email', user.email);
			timeIn.set('CurrentDate', currentDate);
			timeIn.set('Year', currentYear);
			timeIn.set('Month', currentMonth);
			timeIn.set('TimeIn', currentDateTime);
			timeIn.set('CurrentDateTime', currentDateTime);
			timeIn.set('TimeOut', "NULL");


			timeIn.save(function(err){

				if(err) {

					console.log("error");

				} else {
					console.log("inserted");
					console.log("inserted");
					console.log(user.username);
					console.log(user.email);
					console.log(currentDate);
					console.log(currentMonth);
					console.log(currentYear);
					console.log(currentTime);
					console.log(currentDateTime);
					
				}
			});


			req.session.regenerate(function(){
				
				req.session.user = user.id;
				req.session.username = user.username;
				req.session.email = user.email;
				req.session.PermissionType = user.PermissionType;
				
				req.session.msg = 'Authenticated as ' + user.username;

				res.redirect('/');
				// res.redirect('/adminPage');
			});


		} else {

			err = 'Authentication failed.';

		}
		if(err) {

			req.session.regenerate(function(){
				req.session.msg = err;
				res.redirect('/login');
			});

		}
	});
}


exports.getUserProfile = function(req, res){


	User.findOne({username: req.session.username}).exec(function(err, user) {

		if(!user){

			res.json(404, {err: 'User not found'});

		} else {

			res.json(user);

		}
	});
};


exports.logoutUser = function(req, res) {

	console.log("logout Button reached");
	var date = new Date();

	// var currentDate = moment(date).format('MMMM Do YYYY, h:mm:ss a');
	var currentDate = moment(date).format('M/D/YYYY');
	var currentTime = moment(date).format('M/D/YYYY-HH:mm:ss');

	var currentMonth = moment(date).format('M');
	var currentYear = moment(date).format('YYYY');
	var currentDay = moment(date).format('D');

	var currentHour = moment(date).format('h');
	var currentMinutes = moment(date).format('mm');
	var currentSeconds = moment(date).format('ss');


	console.log(req.session.username);
	console.log(req.session.email);
	console.log(currentDate);
	console.log(currentTime);
	console.log(currentMonth);
	console.log(currentYear);
	console.log("------------");


	User.findOne({CurrentDate : currentDate, username: req.session.username, email: req.session.email, TimeOut: "NULL" }).sort({$natural:-1}).exec(function(err, user) {
	//User.findOne({CurrentDate : currentDate, username: req.session.username, email: req.session.email, TimeOut: "NULL" }).exec(function(err, user) {

		if(user) {
			console.log("Found 1");

			console.log("username " + user.username);
			console.log("user email " + user.email);
			console.log("month " + user.Month);
			console.log("year " + user.Year);
			console.log("Current Date " + user.CurrentDate);
			console.log("Time In " + user.TimeIn);
			console.log("Time Out " + user.TimeOut);
			console.log("Current Date Time " + user.CurrentDateTime);	

			// function diff_minutes(dt2, dt1) 
			// {

			// var diff =(dt2.getTime() - dt1.getTime()) / 1000;
			// diff /= 60;
			// return Math.abs(Math.round(diff));

			// }

			var NewTimeIn = new Date(user.TimeIn)
			console.log(NewTimeIn);

			var NewTimeOut = new Date(currentTime)
			console.log(NewTimeOut);


			// var finalHrs = diff_minutes(NewTimeIn, NewTimeOut);
			// console.log(finalHrs);

			// get total seconds between the times
			var delta = Math.abs(NewTimeOut - NewTimeIn) / 1000;

			// calculate (and subtract) whole days
			var days = Math.floor(delta / 86400);
			delta -= days * 86400;

			// calculate (and subtract) whole hours
			var hours = Math.floor(delta / 3600) % 24;
			delta -= hours * 3600;

			// calculate (and subtract) whole minutes
			var minutes = Math.floor(delta / 60) % 60;
			delta -= minutes * 60;

			// what's left is seconds
			var seconds = delta % 60;  // in theory the modulus is not required


			console.log(days, hours, minutes, seconds);

			// var total = "days: " + days + " " + "hours: " + " " +  hours + " " + "minutes: " + " " + minutes + " " + "seconds: " + " " + seconds;
			var total = hours + ":" + minutes + ":" + seconds;
			console.log(total);



			var userInstance = new User(mongoose.model('User'));

			user.set('TimeOut', currentTime);
			user.set('NumbHrs', total);

			user.save(function(err){
				if(err) {
					console.log(err)
				} else {
					
				}
				//res.redirect('/user');
			});


		} else {

			console.log("No User Found");
		}
	});

	req.session.destroy(function(){
  		res.redirect('/login');
  	});

};


exports.updateUser = function(req, res) {

	console.log("Update User Process");

	User.findOne({username: req.session.username}).exec(function(err, user) {

		user.set('email', req.body.email);
		user.set('color', req.body.color);
		user.save(function(err){
			if(err) {
				req.sessor.msg = err;
			} else {
				req.session.msg =  'User Updated';
			}
			res.redirect('/user');
		});

	});
};

exports.deleteUser = function(req, res) {

	User.findOneOne({_id: req.session.user}, function(err, user){

		if(user) {

			user.remove(function(err){

				if(err) {

					req.session.msg = err;	
				}

				req.session.destroy(function(){

					res.redirect('/login');

				});
			});

		} else {

			req.session.msg = "User not found!";

			req.session.destroy(function(){
			  	res.redirect('/login');
			});
		}
	});
};



exports.ViewTimeLogs = function(req, res) {

	var month = req.body.Month;
	var year = req.body.Year;


	User.find({ Month: month, Year: year }).exec(function(err, user) {

		if(err) {
			console.log(err);
		} else {
			res.json(user);
			console.log(user);
		}

	});


};

exports.SearchEmpInfo = function(req, res) {
	console.log("I got the search emp info request");
	console.log(req.body.empEmailSearch);

	User.findOne({email: req.body.empEmailSearch }).exec(function(err, user) {

		if(err) {
			console.log(err);
		} else {
			res.json(user);
			console.log(user);
		}

	});
};

exports.ListAdminFiles = function(req, res) {
	Files.find({}).exec(function(err, files){
		if(err) {
			console.log(err);
		} else {
			res.json(files);
			console.log(files);
		}
	});

}

exports.ListStaffFiles = function(req, res) {
	Files.find({ "metadata.permission" : "_Rglr"}).exec(function(err, files){
		if(err) {
			console.log(err);
		} else {
			res.json(files);
			console.log(files);
		}
	});

}