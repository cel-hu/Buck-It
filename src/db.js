const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

// my schema goes here!
const User = new mongoose.Schema({
	lists: [{type: mongoose.Schema.Types.ObjectId, ref: 'List'}]
});

const Activity = new mongoose.Schema({
	name: {type: String, required: true},
	price: {type: String, required: true},
	tags: {type: [String]},
	checked: {type: Boolean, default: false, required: true}
})
const BucketList = new mongoose.Schema({
	//user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	title: {type: String, required: true},
	//activities: [Activity],
    //createdAt: {type: Date, required: true}
});

mongoose.model('User', User);
mongoose.model('Activity', Activity);
mongoose.model('BucketList', BucketList);
mongoose.connect('mongodb://localhost/ait_final');