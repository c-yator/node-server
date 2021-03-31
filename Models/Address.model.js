const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: Number,
		required: true,
	},
	alternatePhoneNumber: Number,
	deliveryAddress: {
		type: String,
		required: true,
	},
	county: {
		type: String,
		required: true,
	},
	town: {
		type: String,
		required: true,
	},
});

module.exports = AddressSchema;
