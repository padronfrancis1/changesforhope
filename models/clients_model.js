var mongoose = require('mongoose');
	

var ClientSchema = new mongoose.Schema({

	ChildID: {type: Number, unque: true},

	FirstName: {type: String},
	LastName: {type: String},
	Birthdate: {type: Date},
	MiddleName: {type: String},
	Age: {type: Number},
	Gender: {type: String},
	Status: {type: String}

});

mongoose.model('clients', ClientSchema);