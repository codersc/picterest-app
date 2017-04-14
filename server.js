var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var session    = require('express-session')
var bodyParser = require('body-parser');
var passport   = require('passport');
var multer     = require('multer');
var routes     = require('./app/routes/index');

app.use(session({
	secret: 'testsecret',
	resave: false,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

mongoose.connect('mongodb://localhost:27017/pic-terest');

routes(app, passport);

var port = process.env.PORT;

app.listen(port, () => {
  console.log('Server up...');
});
