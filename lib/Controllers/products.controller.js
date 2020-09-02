const mongoose = require('mongoose');
const createError = require('http-errors');
//model
const Product = require('../Models/Product.model');

module.exports = {
	getAllProducts: async (req, res, next) => {
		try {
			const results = await Product.find({}, { __v: 0 });
			res.send(results);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	},
	getProductsById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const product = await Product.findById(id, { __v: 0 });
			console.log(product);
			if (!product) {
				throw createError(404, 'Product does not exist');
			}
			res.send(product);
		} catch (err) {
			console.log(err.message);
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid product id'));
			}
			next(err);
		}
	},
	createProduct: async (req, res, next) => {
		try {
			const { name } = req.body;
			const isFound = await Product.findOne({ name });
			if (isFound) throw createError.Conflict(`${name} is already in store`);
			const product = new Product(req.body);
			const result = await product.save();
			res.send(result);
		} catch (err) {
			console.log(err);
			if (err.name === 'ValidationError') {
				return next(createError(422, err.message));
			}
			next(err);
		}
	},
	updateProductById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const updates = req.body;
			const options = { new: true };
			const result = await Product.findByIdAndUpdate(id, updates, options);
			if (!result) {
				throw createError(404, 'Product does not exist');
			}
			res.send(result);
		} catch (err) {
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid product id'));
			}
			next(err);
		}
	},
	deleteProductById: async (req, res, next) => {
		try {
			const { id } = req.params;
			const result = await Product.findByIdAndDelete(id);
			if (!result) {
				throw createError(404, 'Product does not exist');
			}
			res.send(result);
		} catch (err) {
			console.log(err.message);
			if (err instanceof mongoose.CastError) {
				return next(createError(400, 'Invalid product id'));
			}
			next(err);
		}
	},
};
