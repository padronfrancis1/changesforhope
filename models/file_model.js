var mongoose = require('mongoose');
	

var Files = new mongoose.Schema({

	
	originalname: String

});

mongoose.model('fs.files', Files);