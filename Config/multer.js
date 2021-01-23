const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
//mongo connection
const conn = mongoose.connection;

// create storage engine
const storage = new GridFsStorage({
	db: conn,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) return reject(err);
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename,
					bucketName: 'images',
				};
				resolve(fileInfo);
			});
		});
	},
});

const upload = multer({ storage });

module.exports = upload;
