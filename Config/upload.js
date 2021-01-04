const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '../client/public/images');
	},
	filename: function (req, file, cb) {
		console.log('file', file);
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 3,
	},
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

function checkFileType(file, cb) {
	//allowed ext
	const filetypes = /jpeg|jpg/;
	//check ext
	const extname = filetypes.test(
		path.extname(file.originalname).toLocaleLowerCase()
	);
	// check mime
	const mimetype = filetypes.test(file.mimetype);
	if (mimetype && extname) {
		cb(null, true);
	} else {
		cb('Error: Only image files can be uploaded');
	}
}

module.exports = upload;
