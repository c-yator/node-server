const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../../Config/jwtConfig');

//controller
const {
	pushToFavorites,
	pullFromFavorites,
	clearFavorites,
} = require('../../Controllers/favorites.controller');

// @method:patch'/push'
// @desc: push product To Favorites
// @access: private

router.patch('/push', pushToFavorites);

// @method:patch'/pull'
// @desc: pull product from Favorites
// @access: private

router.patch('/pull', pullFromFavorites);

// @method:patch'/clear'
// @desc: clear Favorites
// @access: private

router.patch('/clear', clearFavorites);

module.exports = router;
