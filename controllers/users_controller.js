// this acts like the common.cs where data are being pulled and pushed
var crypto = require('crypto');
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Files = mongoose.model('fs.files'),
	UserTimeLogs = mongoose.model('UserTimeLogs');

var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var moment = require('moment');

// var sql = require('mssql');
var mysql = require('mysql');

// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	port: 3305,  	
// 	user: 'root',
// 	password: 'admin',
// 	database: 'cfh_prod'
// });

var connection = mysql.createConnection({
	host: 'sql3.freemysqlhosting.net',
	port: 3306,  	
	user: 'sql3169338',
	password: 'agWUkPxUlM',
	database: 'sql3169338'
});


// var config = {
// 	user: 'Francis',
//     password: '',
//     server: 'localhost', 
//     database: 'cfh_prod' 
// };



exports.SqlConnect = function(req, res) {
	console.log("I Got the request");
	connection.connect(function(error, db){
		if(!error) {
			console.log(db);

		} else {
			console.log(error);
		}
	});

};



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



	var input = JSON.parse(JSON.stringify(req.body));

	var params = {
		LAST_NAME: input.username,
		MIDDLE_NAME: input.middlename,
		FIRST_NAME: input.firstname,
		CONTACT_NO: input.phonenumber,
		//HOME_ADDRESS: input.middlename,
		EMAIL_ADDRESS: input.lastname,
		STAFF_Username: input.username,
		STAFF_Password: hashPW(input.password),
		STAFF_PERMISSION_TYPE: input.permission
	};

	console.log(params);


	console.log("Using mysql");


	var query = connection.query("INSERT INTO T_LOGIN_INFO set ? ",params, function(err, rows)
    {

      if (err)
        console.log("Error inserting : %s ",err );
     
      	req.session.destroy(function(){
	  		res.redirect('/login');
	  	});
      
    });






};


exports.login = function(req, res) {

	console.log("login");

	// if( req.body.username == "admin") {
	// 	admin(req, res);
	// } else {
	// 	user(req, res);
	// }
	var today = new Date();

	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

	

	// var currentDate = moment(date).format('M/D/YYYY');
	var currentDateTime = moment(today).format('M/D/YYYY HH:mm:ss');
	console.log("Logout Date: " + currentDateTime);
	// var currentTime = moment(date).format('h:mm:ss a');

	// var currentMonth = moment(date).format('M');
	// var currentYear = moment(date).format('YYYY');

	var username = req.body.username;
	


	var query = connection.query("SELECT * FROM T_LOGIN_INFO WHERE STAFF_Username = ?",[username], function(err, user)
    {

      	//res.redirect('/signup');

  		if(!user) {

			err = 'User not found.';
			console.log(err);

		} else if (user[0].STAFF_Password === hashPW(req.body.password.toString())) 
		
		{

			console.log("Login Successfully");


			var params = {
				STAFF_ID: user[0].STAFF_ID,
				TIME_LOGIN: dateTime,
				STAFF_Username: user[0].STAFF_Username
			};

			var queryLogin = connection.query("INSERT INTO T_LOGIN_INFO_TIME set ? ",params, function(err, rows) {

				if (err)
					console.log("Error inserting : %s ",err );

					// res.render('error');
			});


			if( user[0].STAFF_PERMISSION_TYPE == "Admin") {

					req.session.regenerate(function() {
					
					req.session.staff_id = user[0].STAFF_ID;
					req.session.username = user[0].STAFF_Username;
					req.session.email = user[0].EMAIL_ADDRESS;
					req.session.PermissionType = user[0].STAFF_PERMISSION_TYPE;
					req.session.msg = 'Authenticated as ' + user.PermissionType;

					console.log("Admin account" + "" + req.session.PermissionType);
					// res.redirect('/');
					res.redirect('/adminPage');
				});
			} else {
					req.session.regenerate(function() {
						
					req.session.staff_id = user[0].STAFF_ID;
					req.session.username = user[0].STAFF_Username;
					req.session.email = user[0].EMAIL_ADDRESS;
					req.session.PermissionType = user[0].STAFF_PERMISSION_TYPE;
					req.session.msg = 'Authenticated as ' + user.PermissionType;

					res.redirect('/');
					// res.render('/');
				});
			}
			


		} else {

			err = 'Authentication failed.';

		}


      
    });

};


exports.logoutUser = function(req, res) {

	console.log("logout Button reached");
	var today = new Date();

	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

	
	var currentDateTime = moment(today).format('MM-DD-YYYY HH:mm:ss');
	
	var id =  req.session.staff_id;

	// var params = {
	// 	//STAFF_ID: user[0].STAFF_ID,
	// 	TIME_LOGOUT: dateTime
	// };

	var query = connection.query("UPDATE T_LOGIN_INFO_TIME set TIME_LOGOUT='"+ dateTime +"' WHERE STAFF_ID = '"+ id +"' AND TIME_LOGOUT IS NULL" , function(err, rows) {

		if(err) {
			console.log(err);
		} else {





			var querySelectTop = connection.query("SELECT * FROM T_LOGIN_INFO_TIME WHERE STAFF_ID = '"+ id +"' ORDER BY TIME_LOGIN DESC LIMIT 1;" , function(err, latestRecord) {
    		

				if (err) {
					console.log("Error updating : %s ",err );
				} else {



					var params = {
						SECONDS: 10000000
					};

					var selectedDate = new Date();
					var selectedDate_param = moment(latestRecord[0].TIME_LOGIN).format('MM-DD-YYYY HH:mm:ss');

					console.log("Log in Date:" + selectedDate_param);
					console.log("Logout Date: " + currentDateTime);

					var t1 = new Date(selectedDate_param);
					var t2 = new Date(currentDateTime);
					var dif = t1.getTime() - t2.getTime();

					var Seconds_from_T1_to_T2 = dif / 1000;
					var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);

					console.log(t1);
					console.log(t2);
					console.log(Seconds_Between_Dates);

					// var seconds = connection.query("SELECT TIMESTAMPDIFF(SECOND,'" + selectedDate_param + "','" + currentDateTime + "');", function(err, secondResult){
					// 	if(err) {
					// 		console.log(err);
					// 	} else {
					// 		console.log(secondResult);
					// 	}
					// });

					var queryInsertSeconds = connection.query("UPDATE T_LOGIN_INFO_TIME set SECONDS = '"+ Seconds_Between_Dates +"' WHERE STAFF_ID = '" + latestRecord[0].STAFF_ID + "' ORDER BY TIME_LOGIN DESC LIMIT 1;",params, function(err, rows) {

						if (err)
							console.log("Error inserting : %s ",err );

					});
				}
					
					// res.render('error');
			});

		}

	});



	req.session.destroy(function(){
  		res.redirect('/login');
  	});

};

exports.getStaffLogs = function(req, res) {
	console.log("Get Staff Logs Reached");
	console.log(req.body.StartDate + ' 00:00:00');
	console.log(req.body.EndDate + ' 00:00:00');

	var start = req.body.StartDate + ' 00:00:00';
	var end = req.body.EndDate + ' 23:59:59';

	var queryLogin = connection.query("SELECT STAFF_Username, SUM(SECONDS) as seconds FROM T_LOGIN_INFO_TIME WHERE TIME_LOGIN BETWEEN '" + start + "' AND '" + end + "' GROUP BY STAFF_Username;", function(err, data) {
		if(err) {
			console.log(err);
		} else {
			res.json(data);
		}
	});
}

exports.getAllStaffLogs = function(req, res) {
	console.log("Get All Staff Logs Reached");
	console.log(req.body.StartDate + ' 00:00:00');
	console.log(req.body.EndDate + ' 00:00:00');

	var start = req.body.StartDate + ' 00:00:00';
	var end = req.body.EndDate + ' 23:59:59';

	var queryLogin = connection.query("SELECT * FROM T_LOGIN_INFO_TIME WHERE TIME_LOGIN BETWEEN '" + start + "' AND '" + end + "' AND TIME_LOGOUT IS NOT NULL;", function(err, data) {
		if(err) {
			console.log(err);
		} else {
			res.json(data);
		}
	});

}


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