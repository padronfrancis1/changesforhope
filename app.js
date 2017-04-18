var express = require('express');
var path = require('path');
var moment = require('moment');
//var favicon = require('serve-favicon');

// var https = require('https');
var fs = require('fs');
var assert = require('assert');
var Grid = require('gridfs-stream');
var http = require('http');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession}); // persistent store for authenticated sessions

var mongoose = require('mongoose');
require('./models/users_model.js'); // ensures that document is registered in Mongo
require('./models/clients_model.js'); // ensures that document is registered in Mongo
require('./models/progressReports_model.js'); // ensures that document is registered in Mongo
require('./models/UserTimeLogs.js'); // ensures that document is registered in Mongo
require('./models/file_model.js'); // ensures that document is registered in Mongo
require('./models/incidentReports_model.js'); // ensures that document is registered in Mongo

//var conn = mongoose.connect('mongodb://localhost/changesforhope');
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://admin:admin@ds145329.mlab.com:45329/changesforhope');
// var db = mongoose.connect('mongodb://localhost/changesforhope');


var routes = require('./routes/index');
var users = require('./routes/users');
//var clients = require('./routes/clients');

var admin = require('./routes/admin');



var app = express(); // initialize

app.engine('.html', require('ejs').__express); // used to enalbe html extension as views
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
//app.set('view engine', 'handlebars');
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  secret: 'SECRET',
  // cookie: {maxAge: 60*60*1000},
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    // db: mongoose.connection.db,
    mongooseConnection: db.connection,
    collection: 'sessions'
  })
}));

// Express Session

// app.use(expressSession({
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: true
// }));

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.use('/', routes);
app.use('/users', users);
//app.use('/clients', clients);

app.use('/admin', admin);

// require('./routes')(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





// var options = {
//   key: fs.readFileSync('key1.pem'),
//   cert: fs.readFileSync('cert1.pem')
// };

// https.createServer(options, app).listen(5000);

// http.createServer(app).listen(80);


module.exports = app;
var port = Number(process.env.PORT || 8080);
// var port = Number(process.env.PORT);
http.createServer(app).listen(port);

// module.exports = app;