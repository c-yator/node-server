const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
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
	category: {
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
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('product', ProductSchema);
