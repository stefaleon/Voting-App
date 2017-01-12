const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: {
			type: String,
			default: 'admin'
		}
	},
	options: [{
		opId: String,
		opName: String,
		opVotes: {
			type: Number,
			default: 0
		}
	}],
	IPs: [String]
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
