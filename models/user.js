const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
