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
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model('product', ProductSchema);
const Offer = mongoose.model('offer', ProductSchema);

module.exports = {
	Product,
	Offer,
};
