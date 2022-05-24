var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var poolRouter = require('./routes/pool');
var authRouter = require('./routes/auth');
var resetRouter = require('./routes/reset');

require('dotenv').config()
let models = require('./models')
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pool', poolRouter);
app.use('/auth', authRouter);
app.use('/reset', resetRouter);


//Sync Database
models.sequelize.sync().then(function() { 
    console.log('BD Ok')
}).catch(function(err) {
    console.log(err, "BD Error") 
});

module.exports = app;
