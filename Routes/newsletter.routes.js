const express = require('express');
const router = express.Router();

const { subscribe } = require('../Controllers/newsletter.controller');

//subscribe email
router.post('/', subscribe);

module.exports = router;
