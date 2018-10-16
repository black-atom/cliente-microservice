const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const { bypass, host, port } = require('./config/authConfig')();
const authorizationMiddleware = require('photon-authorization-middleware');
const cors = require('cors');

const db = require("./databaseConnection");

const clienteRoute = require('./routes/clienteRoute');
const contratoRoute = require('./routes/contratoRoute');
const produtoRoute = require('./routes/produtoRoute');
const produtoDisponivelRoute = require('./routes/produtoDisponivelRoute');
const produtoReservadoRoute = require('./routes/produtoReservadoRoute');
const orderBuyRoute = require('./routes/orderCompraRoute');
const estoqueRoute = require('./routes/estoqueRoute.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", authorizationMiddleware(bypass, host, port));

app.use(cors());

app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());


/* Define Routes */
const baseUri = "/api";

app.use(baseUri, clienteRoute);
app.use(baseUri, contratoRoute);
app.use(baseUri, produtoRoute);
app.use(baseUri, produtoDisponivelRoute);
app.use(baseUri, produtoReservadoRoute);
app.use(baseUri, orderBuyRoute);
app.use(baseUri, estoqueRoute);

app.use((err, req, res, next) => {
	switch(err.name){
    case 'ValidationError':{
        err.status = 422;
    }
	}
	next(err);
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
  res.locals.error = req.app.get('env') === 'development' ? err : err;

  console.error(err.stack || err)
  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
