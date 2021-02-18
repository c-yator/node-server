const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../../../Config/jwtConfig');
const upload = require('../../../Config/multer');

//controller
const {
	getAllOffers,
	getOffersById,
	createOffer,
	updateOffersById,
	deleteOffersById,
} = require('../../Controllers/offers.controller');

// @method: GET '/'
// @desc: get a list of all Offers
// @access: public

router.get('/', getAllOffers);

// @method: GET '/:id'
// @desc: get an Offers by id
// @access: public

router.get('/:id', getOffersById);

// @method: POST '/'
// @desc: create an Offer
// @access: private

router.post('/', upload.single('img'), createOffer);

// @method: PATCH '/:id'
// @desc: update Offer by id
// @access: private

router.patch('/:id', upload.single('img'), updateOffersById);

// @method: DELETE '/:id'
// @desc:  delete Offer by id
// @access: private

router.delete('/:id', deleteOffersById);

module.exports = router;
