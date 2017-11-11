 
require('rootpath')();
var express  = require('express');
var  nodemailer = require('nodemailer');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
// var xoauth2 = require('xoauth2');
require('./app/models/seed.js');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
// #############################################################
/*fs = require('fs')
url = require('url');*/
// #############################################################

var configDB = require('./config/database.js');

// configuration 
mongoose.connect(configDB.url); // connection to database

require('./config/passport')(passport); // pass through the passport for configuration middleware

// set express application
app.use(morgan('dev')); 
app.use(cookieParser());  
app.use(bodyParser()); 
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile); 
app.use(express.static('public'));


// #############################################################
/*app.get('/receive', function(request, respond) {
    var body = '';
    filePath = __dirname + '/public/data.txt';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.appendFile(filePath, body, function() {
            respond.end();
        });
    });
});
*/
// #############################################################
//var dotenv = require('dotenv');
//dotenv.load();

//controllers for html pages

/*app.use('/login', require('./app/controllers/logincontroller.js'));
*/

app.use(session({ secret: 'itisabigsecret' })); 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 


require('./app/routes.js')(app, passport); 

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/

/*--------------------Routing Over----------------------------*/

app.listen(port);
console.log('The server is run on http://localhost:' + port);




