const mongoose = require('mongoose');

const offersSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	priceType: {
		type: String,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('offer', offersSchema);
