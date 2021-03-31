const express = require('express');
const router = express.Router();

const {
	stk,
	CallBackURL,
	stkQuery,
	paymentConfirmation,
} = require('../Controllers/stk.controller');

const generateAccessToken = require('../Middleware/generateAccessToken');

/*registerURL */
router.post('/', generateAccessToken, stk);

router.post('/callback', CallBackURL);

router.post('/query', generateAccessToken, stkQuery);

router.get('/paymentConfirmation', paymentConfirmation);

module.exports = router;
