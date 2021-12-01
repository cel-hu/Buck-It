const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
const passportLocalMongoose = require('passport-local-mongoose')

// my schema goes here!
const User = new mongoose.Schema({
	username: String,
	password: String
});

User.plugin(passportLocalMongoose);

const BucketList = new mongoose.Schema({
	user: String,
	title: String,
	activities: [{
		name: String,
		price: Number,
		tags: String
	}]
});

mongoose.model('User', User);
//mongoose.model('Activity', Activity);
mongoose.model('BucketList', BucketList);
//mongoose.connect('mongodb://localhost/ait_final');
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then((x) => console.log('Connected to the DB').catch(err => console.error('Error while connecting to DB', err)));
module.exports = {mongoose};