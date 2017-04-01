var mongoose = require('mongoose'),
		Clients = mongoose.model('clients'),
		IncidentReports = mongoose.model('incidentReports'),
		progressReports = mongoose.model('progressReports');
		

var moment = require('moment');
		



exports.AddClient = function(req, res) 
{

	console.log("I got the request");

	Clients.findOne({ Firstname: req.body.fname, LastName: req.body.lname }).exec(function(err, client){
		
		if(client) {
			//req.session.msg = "Clients Firt name and Last name already exist, Please double check";
			console.log("Client already exists");
			//res.redirect('/admin/addclients');
		} else {
			console.log("You can add user");

			var client = new Clients(mongoose.model('clients'));

			
			client.set('FirstName', req.body.fname);
			client.set('LastName', req.body.lname);
			client.set('MiddleName', req.body.mname);
			client.set('Age', req.body.age);
			client.set('Gender', req.body.gender);
			client.set('Status', req.body.status);

			console.log(req.body.status);

			client.save(function(err){

				if(err) {

					// res.session.error = err;
					console.log(err);
					// res.redirect('/adminAddClient');

				} else {
					console.log("Successful Client Add");
					res.redirect('/adminPage');

				}
			});


		}
	});


};

exports.ListAllClient = function(req, res) 
{

	if(req.session.user) {

		Clients.find({}).exec(function(err, clients){

			if(!clients){

				res.json(404, {err: 'User not found'});

			} else {

				res.json(clients);

			}

		});

	} else {

		res.redirect('/');
	}
	

};


exports.GetClientProfile = function(req, res) 
{

	console.log(req.body.fnames);
	console.log(req.body.mnames);
	console.log(req.body.lnames);
	Clients.findOne({ FirstName: req.body.fnames, LastName: req.body.lnames, MiddleName: req.body.mnames }).exec(function(err, client) {

		if(!client){
			
			res.json(404, {err: 'User not found'});

		} else {
			
			res.json(client);

			console.log(client);
			
		}


	});

};

exports.UpdateClient = function(req, res) 
{

	console.log("Update Client Process");

	// console.log(req.body.info.Age);


	Clients.findOne({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames }).exec(function(err, client) {

		if(client)
		{
			console.log("Found ONe");
		}else{
			console.log("X");
		}

		client.set('FirstName', req.body.fnameu);

		client.set('MiddleName', req.body.mnameu);

		client.set('LastName', req.body.lnameu);

		client.set('Age', req.body.ageu);

		client.set('Gender', req.body.genderu);

		client.set('Status', req.body.statusu);


		client.save(function(err){
			if(err) {
				req.sessor.msg = err;
			} else {
				req.session.msg =  'User Updated';
			}
			res.redirect('/clientsProfile');
		});

	});
};

exports.AddProgressReport = function(req, res) 
{
	console.log(req.body.infoFirstUpdate);
	console.log(req.body.infoLastUpdate);
	console.log(req.body.infoMiddleUpdate);
	Clients.findOne({ FirstName: req.body.infoFirstUpdate, MiddleName: req.body.infoMiddleUpdate, LastName: req.body.infoLastUpdate }).exec(function(err, client) {

		if(client)
		{

			console.log("Found one");
			var date_incident = new Date();
			var currentDateTime = moment(date_incident).format('M/D/YYYY-HH:mm:ss');
			var currentDate = moment(date_incident).format('M/D/YYYY');
			var currentTime = moment(date_incident).format('h:mm:ss a');

			var currentMonth = moment(date_incident).format('M');
			var currentYear = moment(date_incident).format('YYYY');
			var currentDay = moment(date_incident).format('D');

			var progressReport = new progressReports(mongoose.model('progressReports'));

			
			
			progressReport.set('FirstName', req.body.infoFirstUpdate);
			progressReport.set('LastName', req.body.infoLastUpdate);
			progressReport.set('MiddleName', req.body.infoMiddleUpdate);

			progressReport.set('Date', currentDate);
			progressReport.set('Time', currentTime);
			progressReport.set('DateTime', currentDateTime);

			progressReport.set('Hygiene', req.body.progressReport_hygiene);
			progressReport.set('HealthMedication', req.body.progressReport_healthmed);
			progressReport.set('Nutrition', req.body.progressReport_nutrition);
			progressReport.set('Appointments', req.body.progressReport_appoitnments);
			progressReport.set('SchoolHomework', req.body.progressReport_schoolhw);
			progressReport.set('AWOLContact', req.body.progressReport_rel);
			progressReport.set('ProgressGoals', req.body.progressReport_contact);
			progressReport.set('CreatedBy', req.session.username);


			progressReport.save(function(err, success){

				if(err) {

					console.log("not inserted");
					console.log(err);
					res.render('error');


				} else {
					console.log("Successful Progress Report Add");
					console.log(success);
					res.render('success');

				}
			});

		}else{
			console.log("No Clients Found");
		}

	});
};

exports.ViewProgressReport = function(req, res) 
{
	
	console.log("I got the Progress Report Request View");
	// progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames }).exec(function(err, progressReport) {
		// progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, Date: new RegExp('Feb', 'i') }).exec(function(err, progressReport) {
		console.log(req.body.progressMonthlyReport);
		console.log(req.body.fnames);

		

		var str = req.body.progressMonthlyReport;

		var date_prgrss = new Date(str);

		var new_date_prgrss = moment(date_prgrss).format('M/D/YYYY');

		console.log(new_date_prgrss);


		// var response = str.substring(0,12);
		// var cnvrtd_date = moment(response).format('M/D/YYYY');
		// console.log(response);



		progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, Date: new_date_prgrss }).exec(function(err, progressReport) {

		if(progressReport)
		{

			console.log(progressReport);
			res.json(progressReport);

		}else {
			console.log("No Records Found");
		}

	});
};

exports.ViewProgressReportSpecific = function(req, res) 
{
	
	console.log("I got the Specific Progress Report Request View");
	console.log(req.body.fnames);
	console.log(req.body.mnames);
	console.log(req.body.lnames);
	console.log(req.body.progressReport_SpecificDate);
	
	progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, DateTime: req.body.progressReport_SpecificDate }).exec(function(err, ProgressReportSpecific) {

		if(ProgressReportSpecific)
		{

			console.log(ProgressReportSpecific);
			res.json(ProgressReportSpecific);

		}else{
			console.log("Progress Report Not Found");
		}

	});
};


exports.AddIncidentReport = function(req, res) 
{


	Clients.findOne({ FirstName: req.body.infoFirstUpdate, MiddleName: req.body.infoMiddleUpdate, LastName: req.body.infoLastUpdate }).exec(function(err, client) {

		if(client)
		{
			console.log("client exist");
			var date_incident = new Date();

			var currentDate = moment(date_incident).format('M/D/YYYY');
			var currentDateTime = moment(date_incident).format('M/D/YYYY-HH:mm:ss');
			var currentTime = moment(date_incident).format('h:mm:ss a');

			var currentMonth = moment(date_incident).format('M');
			var currentYear = moment(date_incident).format('YYYY');
			var currentDay = moment(date_incident).format('D');


			var IncidentReports = new progressReports(mongoose.model('progressReports'));

			IncidentReports.set('FirstName', req.body.infoFirstUpdate);
			IncidentReports.set('LastName', req.body.infoMiddleUpdate);
			IncidentReports.set('MiddleName', req.body.formDataUpdate_infoLastUpdate);

			IncidentReports.set('DateTime', currentDateTime);
			IncidentReports.set('Month', currentMonth);
			IncidentReports.set('Day', currentDay);
			IncidentReports.set('Year', currentYear);

			IncidentReports.set('Incident', req.body.incident);
			IncidentReports.set('Actions', req.body.action);
			IncidentReports.set('CreatedBy', req.session.username);

			IncidentReports.set('Type', "Incident");

			IncidentReports.save(function(err, success){

				if(err) {

					console.log("not inserted");
					//res.redirect('/error');


				} else {
					console.log("Successful Progress Report Add");
					res.render('success');
					//mongoose.connection.close();


				}
			});





		}else{
			console.log(err);
			
		}

	});


};


exports.ViewIncidentReport = function(req, res) 
{
	
	// progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames }).exec(function(err, progressReport) {
		// progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, Date: new RegExp('Feb', 'i') }).exec(function(err, progressReport) {
		var month = req.body.Month;
		var year = req.body.Year;


		console.log(month);
		console.log(year);


		progressReports.find({ Type: 'Incident', Month: month, Year: year }).exec(function(err, incidentReport) {

		if(incidentReport)
		{

			console.log(incidentReport);
			res.json(incidentReport);

		}else {
			console.log("No Records Found");
		}

		});
};


exports.ViewIncidentReportSpecific = function(req, res) 
{

	console.log(req.body.fnames);
	console.log(req.body.mnames);
	console.log(req.body.lnames);
	console.log(req.body.incidentReport_SpecificDate);
	
	// progressReports.find({ FirstName: req.body.fnames, MiddleName: req.body.mnames, LastName: req.body.lnames, DateTime: req.body.incidentReport_SpecificDate }).exec(function(err, incidentReportSpecific) {
	progressReports.find({DateTime: req.body.incidentReport_SpecificDate}).exec(function(err, incidentReportSpecific) {

		if(incidentReportSpecific)
		{

			console.log(incidentReportSpecific);
			res.json(incidentReportSpecific);

		}else{
			console.log("Progress Report Not Found");
		}

	});
};