const joi = require('joi');

const registerSchema = joi.object({
	username: joi.string().min(2).max(30),
	email: joi.string().email().lowercase().required(),
	password: joi.string().min(8).max(30).required(),
});
const loginSchema = joi.object({
	email: joi.string().email().lowercase().required(),
	password: joi.string().min(8).max(30).required(),
});

module.exports = {
	registerSchema,
	loginSchema,
};
