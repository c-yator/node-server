const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

UserSchema.pre('save', async function (next) {
	try {
		const hashedPassword = await bcrypt.hash(this.password, 14);
		this.password = hashedPassword;
		next();
	} catch (err) {
		next(err);
	}
});

UserSchema.methods.comparePasswords = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (err) {
		throw err;
	}
};

module.exports = mongoose.model('user', UserSchema);
