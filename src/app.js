require('./db');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const uri = process.env.MONGODB_URI;

const path = require('path');

const session = require('express-session');
const sessionOptions = { 
	secret: 'secret', 
	saveUninitialized: true, 
	resave: true 
};
app.use(session(sessionOptions));

app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const User = mongoose.model('User');
const BucketList = mongoose.model('BucketList');
const Activity = mongoose.model('Activity');

app.get('/', function(req, res) {
    res.render('index');
    //res.send('Home Page');
});

app.get('/signup', function(req, res) {
    res.render('signup');
    res.redirect('/list/create');
});

/* passport.js
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { 
                return done(err); 
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));
*/


app.get('/signin', function(req, res) {
    res.render('signin');
    res.redirect('/list/create');
});

app.get('/list', function(req, res) {
    BucketList.find(function(err, bucketlists) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('list', {bucketlists: bucketlists})
        }
    });
});

app.get('/list/create', function(req, res) {
    res.render('create');
});

app.post('/list/create', function(req, res) {
    new BucketList({
        name: req.body.name,
        activities: []
    }).save(function() {
        if (req.session.bucketList !== undefined) {
            req.session.bucketList.push({
                //user: req.body.user,
                name: req.body.name,
                activities: []
                //createdAt: req.body.createdAt
            });
        }
        else {
            req.session.bucketList = [];
            req.session.bucketList.push({
                //user: req.body.user,
                name: req.body.name,
                activities: []
                //createdAt: req.body.createdAt
            });
        }
    });
    res.render('list');
});

app.get('/list/slug', function(req, res) {
    res.render('slug');
});

app.post('/list/slug', function(req, res) {
    const tag = String(req.body.tag).split(',');
    new Activity({
        name: req.body.name,
        price: req.body.price, 
        tag: [...tag], 
        checked: req.body.checked
    }).save(function() {
        if (req.session.activities !== undefined) {
            req.session.activities.push({
                name: req.body.name,
                price: req.body.price,
                tag: [...tag],
                checked: req.body.checked
            });
        }
        else {
            req.session.activities = [];
            req.session.activities.push({
                name: req.body.name,
                price: req.body.price,
                tag: [...tag],
                checked: req.body.checked
            });
        }
    });
    res.render('slug');
});

app.listen(process.env.PORT || 5000);