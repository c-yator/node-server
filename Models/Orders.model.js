const mongoose = require('mongoose');
const AddressSchema = require('./Address.model');

const OrderSchema = mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
	},
	cart: {
		type: Array,
	},
	paymentID: {
		type: String,
		required: true,
	},
	address: AddressSchema,
});

module.exports = mongoose.model('order', OrderSchema);
