// JavaScript source code
var myApp = angular.module('myApp', ['angular.filter','daterangepicker', 'ngFileUpload', 'ngMaterial', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);

myApp.directive('validPasswordC', function() {
  return {
    require: 'ngModel',
    scope: {

      reference: '=validPasswordC'

    },
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue, $scope) {

        var noMatch = viewValue != scope.reference
        ctrl.$setValidity('noMatch', !noMatch);
        return (noMatch)?noMatch:!noMatch;
      });

      scope.$watch("reference", function(value) {;
        ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

      });
    }
  }
});

myApp.directive('fileModel', ['$parse', function ($parse) {
return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
};
}]);


myApp.controller('MyCtrl',['$scope', '$http', '$filter',  '$interval', '$mdSidenav', '$mdMedia', '$mdDialog','Upload', '$timeout', function ($scope, $http ,$filter, $interval, $mdSidenav, $mdMedia, $mdDialog, Upload, $timeout) {

		// fab menu
		$scope.isOpen = false;

		$scope.demo = {
		isOpen: false,
		count: 0,
		selectedDirection: 'left'
		};


		$scope.reloadRoute = function() {
		   $route.reload();
		}
		//fab menu

		
		// side nav
		$scope.toggleLeft = buildToggler('left');
		$scope.toggleRight = buildToggler('right');

		function buildToggler(componentId) {
			return function() {
				$mdSidenav(componentId).toggle();
			};
		}

		$scope.SqlConnect = function(res, req) {
			$http.get('/SqlConnect', function(){

	    	}).then(function(err, connected){
	    		
	    		if(err) {
	    			console.log(err);
	    		} else {
	    			console.log(connected);
	    		}
	    		
	    	});
		};


		$scope.uploadFile = function(){

	        var file = $scope.myFile;
	        var permissionFile = $scope.signUpForm.FilePermission;

	        var uploadUrl = "/multer";
	        var fd = new FormData();
	        // fd.append('username', 'Chris');
	        fd.append('file', file, file.name + "_" + permissionFile);


	        $http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(){
	          console.log("success!!");

	        })
	        .error(function(){
	          console.log("error!!");
	        });
	    };

	    $scope.ListAdminFiles = function() {
	    	$http.get('/adminFiles', function(){

	    	}).then(function(response){
	    		
	    		$scope.files = response.data;
	    	});
	    };

	    $scope.ListStaffFiles = function() {
	    	$http.get('/staffFiles', function(){

	    	}).then(function(response){
	    		
	    		$scope.files = response.data;
	    	});
	    }


		$scope.today = function() {
			$scope.dt = new Date();
		};

		$scope.today();

		$scope.clear = function() {
			$scope.dt = null;
		};

		$scope.options = {
			customClass: getDayClass,
			minDate: new Date(),
			showWeeks: true
		};

		$scope.genderState = '';
        $scope.genders = ('Male Female').split(' ').map(function (state) { return { abbrev: state }; });

        $scope.statusState = '';
        $scope.statuses = ('Approved Declined').split(' ').map(function (state) { return { abbrev: state }; });

        $scope.permissionType = '';
        $scope.permissions = ('Admin Team-Lead Staff').split(' ').map(function (state) { return { abbrev: state }; });

        $scope.permissionTypeFile = '';
        $scope.FilePermission = ('Rglr Admn').split(' ').map(function (state) { return { abbrev: state }; });

     
		// Disable weekend selection
		function disabled(data) {
			var date = data.date,
		  	mode = data.mode;
			return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		}

		$scope.toggleMin = function() {
			$scope.options.minDate = $scope.options.minDate ? null : new Date();
		};

		$scope.toggleMin();

		$scope.setDate = function(year, month, day) {
			$scope.dt = new Date(year, month, day);
		};

		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var afterTomorrow = new Date(tomorrow);
		afterTomorrow.setDate(tomorrow.getDate() + 1);
		$scope.events = [
		{
		  date: tomorrow,
		  status: 'full'
		},
		{
		  date: afterTomorrow,
		  status: 'partially'
		}
		];

		function getDayClass(data) {
			var date = data.date,
			  mode = data.mode;
			if (mode === 'day') {
			  var dayToCheck = new Date(date).setHours(0,0,0,0);

			  for (var i = 0; i < $scope.events.length; i++) {
			    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

			    if (dayToCheck === currentDay) {
			      return $scope.events[i].status;
			    }
			  }
			}

			return '';
		}



		var tick = function() {
			$scope.clock = Date.now();
		}

		tick();

		$interval(tick, 1000);


		$http.get('/client/source').then(function(response){

			$scope.clients = response.data;

		});

		$scope.AllClientsNav = function() {
			$http.get('/client/source').then(function(response){

				$scope.clients = response.data;

			});
		}



		$scope.DownloadFiles = function(files) {
			console.log(files);
			$scope.formData = {};
			$scope.formData.fileName = files;
			$http.get('/mongoDownload', $scope.formData).success(function(data){
				
				// var a = document.createElement('a');
				// a.href = '/mongoDownload';
				// a.target = '_blank';
				// a.download = file;

				// document.body.appendChild(a);
				// a.click();


			});
			
		};

		$scope.userExist = true;
		$scope.checkUserName = function(req, res) {
			$scope.userExist = "";
			
			$scope.label = $scope.formData.username;
			console.log("Checking username"); //username

			$http.post('/checkUserName', $scope.formData).success(function(data){

				if(data) {
					$scope.userExist = true;
				} else {
					$scope.userExist = false;
				}
				
				//$scope.userExist = data;

			});
		};
		
		$scope.change = function() {
			
			$scope.formData.fnameu = $scope.info.FirstName;
			$scope.formData.mnameu = $scope.info.MiddleName;
			$scope.formData.lnameu = $scope.info.LastName;
			$scope.formData.ageu = $scope.info.Age;
			$scope.formData.genderu = $scope.info.Gender;
			$scope.formData.statusu = $scope.info.Status;
		}

		$scope.prefill = [{fnames: "prefill"}];
		
		$scope.goToPerson = function(fname, mname, lname) {
			$scope.updateStatus = false;
			$scope.formData = {}
			$scope.formData.fnames = fname;
			$scope.formData.mnames = mname;
			$scope.formData.lnames = lname;

			$http.post('/view/clientsProfile', $scope.formData).success(function(data){

				$scope.info = data;
				//console.log(data);

			});
		}

		$scope.ViewProgressReport = function(req, res) {

			$scope.convertedMonthlyReport = $filter('date')($scope.dt, 'medium'); // for conversion to string
			$scope.formData.progressMonthlyReport = $scope.convertedMonthlyReport;

			$http.post('/employee/client/ViewProgressReport', $scope.formData).success(function(data){
					console.log(data);
					$scope.progressReport = data;
				});
		}
		$scope.ViewProgressReportSpecific = function(date) {

			// $scope.formData = {};
			$scope.formData.progressReport_SpecificDate = date;
			console.log($scope.formData.progressReport_SpecificDate);

			$http.post('/employee/client/ViewProgressReportSpecific', $scope.formData).success(function(data){
				$scope.progressReportSpecific = data;
			});
		}

		$scope.getClientInfo = function(req, res) {

			$scope.info = null;
			$scope.formData.info = "";
			$scope.formData.msg = "";
			$scope.formData.fnameu = "";
			$scope.formData.mnameu = "";
			$scope.formData.lnameu = "";
			$scope.formData.ageu = "";
			$scope.formData.genderu = "";
			$scope.formData.statusu = "";

			$http.post('/view/clientsProfile', $scope.formData).success(function(data){

				console.log(data);
				$scope.info = data;

			});
		}

		

		$scope.updateStatus = false;
		$scope.UpdateClient = function(req, res) {

			$http.post('/client/update', $scope.formData).success(function(updateCleintdata){

				console.log(updateCleintdata);
				if(updateCleintdata) {
					$scope.formDataUpdate = updateCleintdata;
					
					$scope.updateStatus = true;
					$scope.AllClientsNav();
					$scope.info = null;
					$scope.formData.info = "";
					$scope.formData.msg = "";
					$scope.formData.fnameu = "";
					$scope.formData.mnameu = "";
					$scope.formData.lnameu = "";
					$scope.formData.ageu = "";
					$scope.formData.genderu = "";
					$scope.formData.statusu = "";
					//location.reload();

				} else {
					$scope.updateStatus = false;
				}
				

			});
		}

		$scope.AddProgressReport = function(req, res) {


			$scope.date = new Date();
			$scope.converted_date = $filter('date')($scope.clock, 'medium'); // for conversion to string
			$scope.formData.progressReport_date = $scope.converted_date;

			$http.post('/AddProgressReport', $scope.formData).success(function(data){

				if(data) {

					$scope.progressReport = data;
					//res.render('success');
					//$window.location.reload();

					
				} else {

					console.log("Progress Report not Added");
					//res.render('error');


				}
				

			});

		}

		$scope.AddIncidentReport = function(req, res) {


			$http.post('/AddIncidentReport', $scope.formData).success(function(data){

				if(data) {

					$scope.incidentReportAdd = data;
					
					//$location.path('/AddIncidentReport');
					res.render('/success');
					
				} else {

					console.log("Incident Report not Added");
					res.render('error');

				}
				

			});
			//$location.path('/AddIncidentReport');
		}

		$scope.ViewIncidentReport = function(req, res) {

			// $scope.logs = "";
			$scope.formData = {};

			$scope.convertedDateLog_Month = $filter('date')($scope.dt, 'M');
			$scope.convertedDateLog_Year = $filter('date')($scope.dt, 'yyyy');

			console.log($scope.convertedDateLog_Month);
			console.log($scope.convertedDateLog_Year);


			$scope.formData.Month = $scope.convertedDateLog_Month;
			$scope.formData.Year = $scope.convertedDateLog_Year;


			$http.post('/ViewIncidentReport', $scope.formData).success(function(data){

				if(data) {

					$scope.incidentReportSearch = data;
					
				} else {

					console.log("Incident Report not Added");

				}
				

			});
		}

		$scope.ViewIncidentReportSpecific = function(date) {

			// $scope.formData = {};
			$scope.formData.incidentReport_SpecificDate = date;
			console.log(date);
			console.log($scope.formData.incidentReport_SpecificDate);

			$http.post('/ViewIncidentReportSpecific', $scope.formData).success(function(data){
				console.log(data);
				$scope.incidentReportSpecificresult = data;
			});
		}




		$scope.status = '  ';
		$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


		$scope.showUsersModal = function(ev) {

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			$mdDialog.show({
				controller: DialogController,
				templateUrl: './progressReport.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: {
					progressReportSpcfc: $scope.progressReportSpecific
				},
				clickOutsideToClose:true,
				fullscreen: useFullScreen
			})
			.then(function(answer) {
				$scope.status = 'You said the information was "' + answer + '".';
			}, function() {
				$scope.status = 'You cancelled the dialog.';
			});



			$scope.$watch(function() {
				return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
					$scope.customFullscreen = (wantsFullScreen === true);
				});
		};

		$scope.showEmployeeLogsModal = function(ev) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			$mdDialog.show({
				controller: DialogController,
				templateUrl: './timeLogs.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: useFullScreen
			})
			.then(function(answer) {
				$scope.status = 'You said the information was "' + answer + '".';
			}, function() {
				$scope.status = 'You cancelled the dialog.';
			});




			$scope.$watch(function() {
				return $mdMedia('xs') || $mdMedia('sm');
				}, function(wantsFullScreen) {
					$scope.customFullscreen = (wantsFullScreen === true);
				});
		};


		function DialogController($scope, $http, $mdDialog, $filter) {

			
			$scope.SelectedDate = {startDate: null, endDate: null};



			var tick = function() {
			  $scope.clock = Date.now();
			}

			tick();

			$interval(tick, 1000);

			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			$scope.answer = function() {
				$mdDialog.hide(answer);
			};

			$scope.StartEndDate = function(res, req) {

				var isoDatestart = new Date($scope.SelectedDate.startDate);
				var start = isoDatestart.toISOString();
				var newStartDate = new Date(start);
				var finalStartDate = moment(newStartDate).format("YYYY-MM-DD");

				var isoDateend = new Date($scope.SelectedDate.endDate);
				var end = isoDateend.toISOString();
				var newEndDate = new Date(end);
				var finalEndDate = moment(newEndDate).format("YYYY-MM-DD");

				//var start = $filter('date')($scope.SelectedDate.startDate, 'yyyy-MM-dd', 'UTC');
				console.log(finalStartDate);
				console.log(finalEndDate);	

				$scope.formData = {};
				$scope.formData.StartDate = finalStartDate;
				$scope.formData.EndDate = finalEndDate;

				$http.post('/getStaffLogs', $scope.formData).success(function(data, err){

					var hours = [];
					if(data)
					{
						console.log(data);
						for(var i = 0; i < data.length; i++) {

							var time = data[i].seconds;
							var user = data[i].STAFF_Username;

							

							var date = new Date(null);
							date.setSeconds(time);
							var result = date.toISOString().substr(11, 8);


							console.log(user);
							console.log(result);
							hours.push(user + ' - ' + result);
							
							
						}
						
						
						//$scope.numberofHours = 
					} else {
						console.log(err);
					}
					
					$scope.numberofHours = hours;
					console.log(data);
					console.log(hours);
						
					});


			}

			$scope.getAllStaffLogs = function(res, req) {

				var isoDatestart = new Date($scope.SelectedDate.startDate);
				var start = isoDatestart.toISOString();
				var newStartDate = new Date(start);
				var finalStartDate = moment(newStartDate).format("YYYY-MM-DD");

				var isoDateend = new Date($scope.SelectedDate.endDate);
				var end = isoDateend.toISOString();
				var newEndDate = new Date(end);
				var finalEndDate = moment(newEndDate).format("YYYY-MM-DD");

				//var start = $filter('date')($scope.SelectedDate.startDate, 'yyyy-MM-dd', 'UTC');
				console.log(finalStartDate);
				console.log(finalEndDate);	

				$scope.formData = {};
				$scope.formData.StartDate = finalStartDate;
				$scope.formData.EndDate = finalEndDate;

				$http.post('/getAllStaffLogs', $scope.formData).success(function(data, err){

						
					if(data)
					{
						
						
						// console.log(data);

						// var myArray = data;

						// var group_to_values = myArray.reduce(function(obj,item){
						//     obj[item.STAFF_Username] = obj[item.STAFF_Username] || [];
						//     obj[item.STAFF_Username].push(item.TIME_LOGIN, item.TIME_LOGOUT);


						//     return obj;
						// }, {});

						// var groups = Object.keys(group_to_values).map(function(key){
						//     return {STAFF_Username: key, TIME_LOGIN: group_to_values[key]};
						// });

						// console.log(groups);


						    $scope.items = data         

						    
					        var result = {};
					        angular.forEach(data, function(value, key) {
					            if (!value.hasOwnProperty('TIME_LOGIN')) {
					                result[key] = value;
					            }
					        });
					        console.log(result);

						
						$scope.allStafflogs = data;
						console.log(data);


					} else {
						console.log(err);
					}
						
					});


			}




			$scope.ShowTimeLogs = function(req, res) {

				$scope.logs = "";
				$scope.formData = {};

				$scope.convertedDateLog_Month = $filter('date')($scope.dt, 'M');
				$scope.convertedDateLog_Year = $filter('date')($scope.dt, 'yyyy');



				$scope.formData.Month = $scope.convertedDateLog_Month;
				$scope.formData.Year = $scope.convertedDateLog_Year;



					$http.post('/employee/view/timeLogs', $scope.formData).success(function(data, err){

						$scope.logs = data;
						if(data)
						{
							console.log("success");
							console.log(data);
						} else {
							console.log(err);
						}
						
					});
				// }
				// else
				// {

				// }
			};



			$scope.SearchEmployees = function(res, req)	{
				
				$http.post('/employee/view/empInfo', $scope.formData).success(function(data){

					$scope.empInformation = data;
				});
			};

			$scope.DownloadCSV = function(res, req) {

				var dataLogs = $scope.logs;
				var csvRows = [];
				//csvRows.push(dataLogs[0].CurrentDate); 
				
				var stockData;
				for(var i =0; i<dataLogs.length; i++) {

					csvRows.push([

						"user: " + " " + dataLogs[i].username ,
						"TimeIn	:" + " " + dataLogs[i].TimeIn, 
						"timeout:" + " " + dataLogs[i].TimeOut,
						dataLogs[i].NumbHrs,
						"\n"

					]);


				}

				// for(var x = 0; x < csvRows.length; x ++)
				// {
				// 	console.log(csvRows[x].username);
				// 	// if(csvRows[x].user =! csvRows[x - 1].user) {
				// 	// 	console.log(csvRows[x].username);
				// 	// 	console.log("not the same");
				// 	// }
				// }
				
				// for(var j=1; j<10; ++j){ 
				//     A.push([j, Math.sqrt(j)]);
				// }

				// var csvRows = [];

				for(var i=0, l=csvRows.length; i<l; ++i){
				    csvRows.push(csvRows[i].join(','));
				}

				var csvString = csvRows.join("%0A");
				var a = document.createElement('a');
				a.href = 'data:attachment/csv,' + csvString;
				a.target = '_blank';
				a.download = dataLogs[0].username + '.csv';

				document.body.appendChild(a);
				a.click();

			};



	}

}]);
