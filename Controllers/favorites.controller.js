const mongoose = require('mongoose');
const createError = require('http-errors');

const { verifyRefreshToken } = require('../Config/jwtConfig');

//model
const User = require('../Models/User.model');

module.exports = {
	pushToFavorites: async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			if (!refreshToken) throw createError.BadRequest();
			const userId = await verifyRefreshToken(refreshToken);
			const { productId } = req.body;
			if (!productId) {
				throw createError.BadRequest('Product Id is required');
			}
			const updates = {
				$addToSet: {
					favorites: productId,
				},
			};
			const options = { new: true };
			const result = await User.findByIdAndUpdate(userId, updates, options);
			if (!result) {
				throw createError(404, 'Item does not exist');
			}
			res.send(result);
		} catch (err) {
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid item id'));
			}
			next(err);
		}
	},
	pullFromFavorites: async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			if (!refreshToken) throw createError.BadRequest();
			const userId = await verifyRefreshToken(refreshToken);
			const { productId } = req.body;
			if (!productId) {
				throw createError.BadRequest('Product Id is required');
			}
			const updates = {
				$pull: {
					favorites: productId,
				},
			};
			const options = { new: true };
			const result = await User.findByIdAndUpdate(userId, updates, options);
			if (!result) {
				throw createError(404, 'Item does not exist');
			}
			res.send(result);
		} catch (err) {
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid item id'));
			}
			next(err);
		}
	},
	clearFavorites: async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			if (!refreshToken) throw createError.BadRequest();
			const userId = await verifyRefreshToken(refreshToken);
			const updates = {
				$set: {
					favorites: [],
				},
			};
			const options = { new: true };
			const result = await User.findByIdAndUpdate(userId, updates, options);
			if (!result) {
				throw createError(404, 'Item does not exist');
			}
			res.send(result);
		} catch (err) {
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid item id'));
			}
			next(err);
		}
	},
};
