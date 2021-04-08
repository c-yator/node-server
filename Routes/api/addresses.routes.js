const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../../Config/jwtConfig');

//controller
const {
	getAllAddresses,
	getAddressById,
	createAddress,
	updateAddressById,
	deleteAddressById,
	setDefaultAddress,
} = require('../../Controllers/address.controller');

// @method: GET '/'
// @desc: get a list of all addresses
// @access: public

router.get('/', getAllAddresses);

// @method: GET '/:id'
// @desc: get a address by id
// @access: public

router.get('/:id', getAddressById);

// @method: POST '/'
// @desc: create an address
// @access: private

router.post('/', createAddress);

// @method: PATCH '/:id'
// @desc: update address by id
// @access: private

router.patch('/:id', updateAddressById);

// @method: PATCH '/setDefaultAddress/:id'
// @desc:  update default address
// @access: private

router.patch('/setDefaultAddress/:id', setDefaultAddress);

// @method: DELETE '/:id'
// @desc:  delete address by id
// @access: private

router.delete('/:id', deleteAddressById);

module.exports = router;
