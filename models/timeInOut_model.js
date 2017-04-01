var mongoose = require('mongoose');
	

var UserTimeLog = new mongoose.Schema({

	username: {type: String, unique: true},
	email: String,
	CurrentDate: String,
	TimeIn: String,
	TimeOut: String
});

mongoose.model('UserTimeLogs', UserTimeLog);