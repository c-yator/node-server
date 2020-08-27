const mongoose = require('mongoose');

module.exports = () => {
	mongoose
		.connect(process.env.MONGO_URI, {
			dbName: process.env.DB_NAME,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		})
		.then(() => console.log('MongoDB connected'))
		.catch((err) => console.log(err.message));

	mongoose.connection.on('connected', () =>
		console.log('mongoose connected to db')
	);
	mongoose.connection.on('error', (err) => console.log(err.message));
	mongoose.connection.on('disconnected', () =>
		console.log('mongoose connection is disconnected ')
	);

	process.on('SIGINT', async () => {
		await mongoose.connection.close();
		process.exit(0);
	});
};
