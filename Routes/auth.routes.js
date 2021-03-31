const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../Config/jwtConfig');
//controllers
const {
	register,
	login,
	refreshToken,
	logout,
	getUser,
} = require('../Controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.delete('/logout', logout);
router.get('/user', verifyAccessToken, getUser);

module.exports = router;
