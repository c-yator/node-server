const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} = require('../../Config/jwtConfig');

//model
const User = require('../Models/User.model');
//validation
const {
	loginSchema,
	registerSchema,
} = require('../../Config/validationSchema');
const client = require('../../Config/init_redis');

module.exports = {
	register: async (req, res, next) => {
		try {
			const validationResult = await registerSchema.validateAsync(req.body);
			const isFound = await User.findOne({ email: validationResult.email });
			if (isFound)
				throw createError.Conflict(
					`${validationResult.email} is already registered`
				);
			const newUser = new User(validationResult);
			const savedUser = await newUser.save();
			const accessToken = await signAccessToken(savedUser.id);
			const refreshToken = await signRefreshToken(savedUser.id);

			const { username } = savedUser;

			res.cookie('refreshToken', refreshToken, {
				// secure: true,
				httpOnly: true,
				sameSite: true,
			});
			res.json({
				username,
				token: accessToken,
			});
		} catch (err) {
			if (err.isJoi === true) err.status = 422;
			next(err);
		}
	},
	login: async (req, res, next) => {
		try {
			const validationResult = await loginSchema.validateAsync(req.body);
			const user = await User.findOne({ email: validationResult.email });
			if (!user) throw createError.NotFound('User not registered');

			const isMatch = await user.comparePasswords(validationResult.password);

			if (!isMatch)
				throw createError.Unauthorized('Invalid Username or Password');
			const accessToken = await signAccessToken(user.id);
			const refreshToken = await signRefreshToken(user.id);

			const { username } = user;

			res.cookie('refreshToken', refreshToken, {
				// secure: true,
				httpOnly: true,
				sameSite: true,
			});
			res.json({ username, token: accessToken });
		} catch (err) {
			if (err.isJoi === true)
				return next(createError.BadRequest('Invalid Username or Password'));
			next(err);
		}
	},
	refreshToken: async (req, res, next) => {
		try {
			// const { refreshToken } = req.body;
			const { refreshToken } = req.cookies;
			if (!refreshToken) throw createError.BadRequest();
			const userId = await verifyRefreshToken(refreshToken);
			const newAccessToken = await signAccessToken(userId);
			const newRefreshToken = await signRefreshToken(userId);

			const user = await User.findById(userId, { __v: 0 });
			const { username } = user;

			res.cookie('refreshToken', newRefreshToken, {
				// secure: true,
				httpOnly: true,
				sameSite: true,
			});
			res.json({ username, token: newAccessToken });
		} catch (err) {
			next(err);
		}
	},
	logout: async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			if (!refreshToken) throw createError.BadRequest();
			const userId = await verifyRefreshToken(refreshToken);
			client.DEL(userId, (err, value) => {
				if (err) {
					console.log(err.message);
					throw createError.InternalServerError();
				}
				res.clearCookie('refreshToken');
				res.sendStatus(204);
			});
		} catch (err) {
			next(err);
		}
	},
	getUser: async (req, res, next) => {
		try {
			const user = await User.findById(req.payload.aud, {
				password: 0,
				__v: 0,
			});
			res.json(user);
		} catch (err) {
			next(err);
		}
	},
};
