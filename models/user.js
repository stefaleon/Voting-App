const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:  {
		type: String,
		required: true,
		minlength: 4,
		trim: true
	},
    password:  {
		type: String,
		minlength: 4,
		trim: true
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
