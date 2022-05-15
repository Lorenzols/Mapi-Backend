var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var poolRouter = require('./routes/pool');
var authRouter = require('./routes/auth');


require('dotenv').config()
let models = require('./models')
let passport = require('passport')
let bodyParser = require('body-parser')
let session = require('express-session')

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pool', poolRouter);
app.use('/auth', authRouter);

//Models
require('./config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function() { 
    console.log('BD Ok')
}).catch(function(err) {
    console.log(err, "BD Error") 
});

//passport
app.use(session({
    secret: 'cosamacosapi',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
