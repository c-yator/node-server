const mongoose = require('mongoose');

const mobilePaymentSchema = mongoose.Schema({
	MerchantRequestID: {
		type: String,
		required: true,
	},
	CheckoutRequestID: {
		type: String,
		required: true,
	},
	ResultCode: {
		type: Number,
		required: true,
	},
	ResultDesc: {
		type: String,
		required: true,
	},
	CallbackMetadata: {
		Item: {
			type: [
				{
					Name: String,
					Value: String,
				},
			],
			required: true,
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('mobilePayment', mobilePaymentSchema);
