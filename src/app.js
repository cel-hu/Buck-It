require('./db');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const BucketList = mongoose.model('BucketList');

const path = require('path');
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(express.urlencoded({extended:false}));

const session = require('express-session');
const sessionOptions = { 
	secret: 'secret', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));

app.set('view engine', 'hbs');


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

app.listen(3000);