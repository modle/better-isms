var express = require('express');
var app = module.exports = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

// set up the db
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.DATABASE_URL);
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// set up static file refs
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// set up logger
var logger = require('morgan');
app.use(logger('dev'));

// set up root and isms routes
var router = express.Router()
var index = require('./routes/index');
app.use('/', index);
var isms = require('./routes/isms');
app.use('/isms', isms);
var loginasdf = require('./routes/login');
app.use('/login', loginasdf);

if(!module.parent){
    app.listen(process.env.PORT || 3000, function(){
        console.log('up and running');
    });
}
