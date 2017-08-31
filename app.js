const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const authConfig = require('./config/authConfig')();
const cors = require('cors');

const db = require("./databaseConnection");

const clienteRoute = require('./routes/clienteRoute');


const app = express();

app.use("/api", 
  jwt({
    secret: authConfig.secret,
    credentialsRequired: !authConfig.bypass
  }), 
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') { 
      return(res.status(401).send('Invalid authorization token'));
    }
    next();
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", (req, res, next) => {

  req.body.createdBy = req.user || 'Ambiente de Test';
  req.body.updatedBy = req.user || 'Ambiente de Test';
  
   next();
})

app.use(cors());

app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());


/* Define Routes */
const baseUri = "/api";

app.use(baseUri, clienteRoute);



app.use((err, req, res, next) => {
	if(err.name === 'MongoError'){
		res.status = 500;
	}
	next();
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.error);
});

module.exports = app;
