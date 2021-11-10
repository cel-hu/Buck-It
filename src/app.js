require('./db');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const BucketList = mongoose.model('BucketList');

const path = require('path');

const session = require('express-session');
const sessionOptions = { 
	secret: 'secret', 
	saveUninitialized: true, 
	resave: true 
};
app.use(session(sessionOptions));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.send('Bucket List');
    res.send('Home Page');
});

app.get('/signup', function(req, res) {
    res.send('Create New User');
});

app.get('/signin', function(req, res) {
    res.send('Sign In To Existing Account');
});

app.get('/list', function(req, res) {
    res.send('All Bucket Lists');
});

app.get('/list/create', function(req, res) {
    res.send('Create New Bucket List');
});

app.get('/list/slug', function(req, res) {
    res.send('Show Specific Bucket List');
});

app.listen(process.env.PORT || 5000);