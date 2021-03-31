const mongoose = require('mongoose');
const createError = require('http-errors');

//model
const Offer = require('../Models/Offer.model');

module.exports = {
	getAllOffers: async (req, res, next) => {
		try {
			const results = await Offer.find({}, { __v: 0 });
			if (!results || !results.length) {
				throw createError.NotFound('No offers found');
			}
			res.send(results);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	getOffersById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const offer = await Offer.findById(id, { __v: 0 });
			console.log(offer);
			if (!offer) {
				throw createError(404, 'offer does not exist');
			}
			res.send(product);
		} catch (err) {
			console.log(err.message);
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid offer id'));
			}
			next(err);
		}
	},
	createOffer: async (req, res, next) => {
		try {
			const { name } = req.body;

			const isFound = await Offer.findOne({ name });
			if (isFound) throw createError.Conflict(`${name} is already in store`);

			const offer = new Offer(req.body);

			console.log('req.file', req.file);

			if (req.file && req.file.filename) {
				offer.image = req.file.filename;
			}

			const result = await offer.save();
			res.send(result);
		} catch (err) {
			console.log(err);

			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},

	updateOffersById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const updates = req.body;
			if (req.file && req.file.filename) {
				updates.image = req.file.filename;
			}
			const options = { new: true };
			const result = await Offer.findByIdAndUpdate(id, updates, options);
			if (!result) {
				throw createError(404, 'Product does not exist');
			}
			res.send(result);
		} catch (err) {
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid offer id'));
			}
			next(err);
		}
	},
	deleteOffersById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const result = await Offer.findByIdAndDelete(id);
			if (!result) {
				throw createError.NotFound('offer does not exist');
			}
			res.send(result);
		} catch (err) {
			console.log(err.message);
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid offer id'));
			}
			next(err);
		}
	},
};
