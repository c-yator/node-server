const createError = require('http-errors');
const mongoose = require('mongoose');
const sharp = require('sharp');

//mongo connection
const conn = mongoose.connection;

let gfs = null;

conn.once('open', () => {
	gfs = new mongoose.mongo.GridFSBucket(conn.db, {
		bucketName: 'images',
	});
});

module.exports = {
	getImageById: async (req, res) => {
		const { filename } = req.params;
		if (!filename) throw createError.BadRequest();

		gfs.find({ filename }).toArray((err, files) => {
			if (err) throw err;
			if (!files || files.length === 0) {
				return res.status(404).json({
					err: 'image not found',
				});
			} else {
				files.map(async ({ contentType, filename }) => {
					try {
						// check if image
						if (contentType === 'image/jpeg' || contentType === 'image/png') {
							// read output to browser
							const resize = await sharp().resize(463, 261).toFormat('jpeg');
							gfs.openDownloadStreamByName(filename).pipe(resize).pipe(res);
						} else {
							res.status(415).json({
								err: 'Not an image',
							});
						}
					} catch (err) {
						if (err) throw err;
					}
				});
			}
		});
	},
};
