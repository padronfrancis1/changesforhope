var mongoose = require('mongoose');
	

var UserSchema = new mongoose.Schema({

	username: {type: String, unque: true},
	FirstName: String,
	MiddleName: String,
	LastName: String,
	PhoneNumber: String,
	Address: String,
	email: String,
	PermissionType: String,
	hashed_password: String,
	Month: String,
	Year: String,
	CurrentDate : String,
	CurrentDateTime: String,
	TimeIn : String,
	TimeOut : String,
	NumbHrs : String

});

mongoose.model('User', UserSchema);