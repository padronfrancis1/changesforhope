var mongoose = require('mongoose');
	

var incidentReports = new mongoose.Schema({

	FirstName: {type: String},
	MiddleName: String,
	LastName: String,
	Month: String,
	Day: String,
	Year: String,
	DateTime: String,
	Incident: String,
	Actions: String,
	CreatedBy: String,
	Type: String


});

mongoose.model('incidentReports', incidentReports);