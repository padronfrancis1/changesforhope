var mongoose = require('mongoose');
	

var UserTimeLogs = new mongoose.Schema({

	username: {type: String, unique: true},
	email: String,
	CurrentDate: String,
	TimeIn: String,
	TimeOut: String,
	Month: String,
	Year: String
});

mongoose.model('UserTimeLogs', UserTimeLogs);