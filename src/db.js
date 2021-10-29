const mongoose = require('mongoose');

// my schema goes here!
const BucketList = new mongoose.Schema({
	user: String,
	name: String,
	activities: [{
		name: String,
		price: String,
		tags: [String],
		checked: Boolean
	}],
    createdAt: Date
});

mongoose.model('BucketList', BucketList);
mongoose.connect('mongodb://localhost/ait_final');