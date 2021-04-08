const mongoose = require('mongoose');
const createError = require('http-errors');

//model
const Address = require('../Models/Address.model');
const User = require('../Models/User.model');

module.exports = {
	setDefaultAddress: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { addressId } = req.body;
			const options = { new: true };
			const updates = { defaultAddress: addressId };
			const results = await User.findByIdAndUpdate(id, updates, options);
			if (!results || !results.length) {
				throw createError.NotFound('user not found');
			}
			res.send(results);
		} catch (err) {
			console.log(err.message);
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid user id'));
			}
			next(err);
		}
	},
	getAllAddresses: async (req, res, next) => {
		try {
			const results = await Address.find({}, { __v: 0 });
			if (!results || !results.length) {
				throw createError.NotFound('No Addresses found');
			}
			res.send(results);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	getAddressById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const address = await Address.findById(id, { __v: 0 });
			if (!address) {
				throw createError(404, 'address does not exist');
			}
			res.send(address);
		} catch (err) {
			console.log(err.message);
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid address id'));
			}
			next(err);
		}
	},
	createAddress: async (req, res, next) => {
		try {
			const { deliveryAddress } = req.body;
			const isFound = await Address.findOne({ deliveryAddress });

			if (isFound)
				throw createError.Conflict(
					`An address with the same delivery address is already saved`
				);
			const address = new Address(req.body);
			const result = await address.save();
			res.send(result);
		} catch (err) {
			console.log(err);
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},

	updateAddressById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const updates = req.body;
			const options = { new: true };
			const result = await Address.findByIdAndUpdate(id, updates, options);
			if (!result) {
				throw createError(404, 'Address does not exist');
			}
			res.send(result);
		} catch (err) {
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid address id'));
			}
			next(err);
		}
	},
	deleteAddressById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const result = await Address.findByIdAndDelete(id);
			if (!result) {
				throw createError.NotFound('Address does not exist');
			}
			res.send(result);
		} catch (err) {
			console.log(err.message);
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Address product id'));
			}
			next(err);
		}
	},
};
