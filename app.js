const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require ('cors');


//test db connection
require('./config/db');


let routes = require('./routes/index');
let users = require('./routes/users');
let dashboard = require('./routes/dashboard');

// Init App
let app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');


//Handlebarshelper ifCond
let hbs = require('handlebars');
hbs.registerHelper('ifCond', function(v1, v2, v3, options) {
  if(v1 === v2 || v1 === v3) {
    return options.fn(this);
  }
  return options.inverse(this);
});
//Handlebarshelper ifUndefinde
hbs.registerHelper('ifUndefined', function(v1, options) {
  if(v1 === undefined) {
    return options.fn(this);
  }
  return options.inverse(this);
});
 
hbs.registerHelper('ifEquals', function(v1, v2,options) {
  return (v1 == v2)? options.fn(this): options.inverse();
})

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Enable CORS
app.use(cors());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/', dashboard);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+ app.get('port'));
});
