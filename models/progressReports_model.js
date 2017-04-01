var mongoose = require('mongoose');
	

var progressReports = new mongoose.Schema({

	FirstName: {type: String},
	MiddleName: String,
	LastName: String,
	Date: String,
	Time: String,
	DateTime: String,
	Hygiene: String,
	HealthMedication: String,
	Nutrition: String,
	Appointments: String,
	SchoolHomework: String,
	AWOLContact: String,
	ProgressGoals: String,
	CreatedBy: String,

	Month: String,
	Day: String,
	Year: String,
	DateTime: String,
	Incident: String,
	Actions: String,
	Type: String


});

mongoose.model('progressReports', progressReports);