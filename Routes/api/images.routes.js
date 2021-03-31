const express = require('express');
const router = express.Router();

//controller
const { getImageByFilename } = require('../../Controllers/image.controller');

// @method: GET '/image/:filename'
// @desc: get image by filename
// @access: public

router.get('/:filename', getImageByFilename);

module.exports = router;
