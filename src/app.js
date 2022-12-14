require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const BucketList = mongoose.model('BucketList');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    User.findOne({username: username}, function (err, user) {
        done(err, user);
    });
});

const sessStore = new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost/ait_final',
});

const sessionOptions = { 
	secret: 'secret', 
    resave: true,
	saveUninitialized: true, 
    store: sessStore
};
app.use(session(sessionOptions));

app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.post('/signup', function(req, res) {
    User.register(new User({username:req.body.username}), req.body.password, function(err) {
        if (err) {
            res.render('error', {message:'Your registration information is not valid'});
        } 
        else {
            passport.authenticate('local')(req, res, function() {
                res.redirect('/');
            });
        }
    });  
});

app.get('/signin', function(req, res) {
    res.render('signin');
});

app.post('/signin', passport.authenticate('local', {failureRedirect: '/' }), function(req, res) {
    res.redirect('/list?user=' + req.body.username);
});

app.get('/list', function(req, res) {
    BucketList.find({}, function(err, title) {
        if (err) {
            res.render('error', {message:'error'});
        }
        else {
            res.render('list', {user: req.query.user, bucketlists: title.filter(title => title.user === req.query.user)});
        }
    });
});

app.get('/list/create', function(req, res) {
    res.render('create', {user: req.query.user});
});

app.post('/list/create', function(req, res) {
    const title = req.body.title;
    const user = req.query.user;
    const newList = new BucketList({
        user: user,
        title: title,
        activities: []
    });
    newList.save(function(err) {
        if (err) {
            res.render('error', {message:'error'});
        }
    });
    res.redirect('/list?user='+user);
});

app.get('/list/delete', function(req, res) {
    BucketList.find({}, function(err, title) {
        if (err) {
            res.render('error', {message:'error'});
        }
        else {
            res.render('delete', {user: req.query.user, bucketlists: title.filter(title => title.user === req.query.user)});
        }
    });
});

app.post('/list/delete', function(req, res) {
    BucketList.deleteOne({title: req.body.title, user: req.query.user}, function(err) {
        if (err) {
            res.render('error', {message:'error'});
        }
    });
    res.redirect('/list?user='+req.query.user);
});

app.get('/list/slug', function(req, res) {
    BucketList.find({title: req.query.title, user: req.query.user}, function(err, title) {
        if (err) {
            res.render('error', {message:'error'});
        }
        else {
            const temp = [];
            title[0].activities.forEach(activities => temp.push(activities));
            const prices = [];
            for (let i = 0; i < title[0].activities.length; i++) {
                prices.push(title[0].activities[i].price);
            }
            const total = prices.reduce((prev, curr) => prev + curr, 0);
            res.render('slug', {activities: temp, title: req.query.title, user: req.query.user, price: total});
        }
    });
});

app.get('/list/slug/add', function(req, res) {
    res.render('add', {title: req.query.title, user:req.query.user});
});

app.post('/list/slug/add', function(req, res) {
    const title = req.query.title;
    const user = req.query.user;
    BucketList.findOne({title: title, user: user}, (err, title) => {
        if (!err && title) {
            const activity = {
                name : req.body.activity,
                price: parseInt(req.body.price),
                tags: req.body.tags
            };
            title.save(title.activities.push(activity));
            res.redirect("/list/slug?title=" + req.query.title + "&user=" + user);
        }
        else {
            res.render('error', {message:'error'});
            res.redirect('/list?user='+ user);
        }
    });
});

app.listen(process.env.PORT || 5000);