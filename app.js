const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const logger = require('./logger');
const webSocket = require('./socket');
const indexRouter = require('./routes');

const app = express();
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

if('production' === process.env.NODE_ENV) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
};
if ('production' === process.env.NODE_ENV) {
  // sessionOption.proxy = true;
  // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));

app.use('/', indexRouter);

app.use((req, res, next) => {
  const error = new Error(`No router for ${req.method}, ${req.url}`);
  error.status = 404;

  logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => {
  // logger.info(`Listening on port ${app.get('port')}`);
  logger.info(`Listening on port ${app.get('port')}`);
});

webSocket(server);
