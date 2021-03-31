require('dotenv').config();

const path = require('path');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

//logger
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//cookie parser
app.use(cookieParser());

//helmet
app.use(helmet());

app.disable('x-powered-by');

//initialize db
require('../Config/init_mongoDB')();
//initialize redis
require('../Config/init_redis');
//routes
const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/products', require('./Routes/api/products.routes'));
apiRouter.use('/offers', require('./Routes/api/offers.routes'));
apiRouter.use('/images', require('./Routes/api/images.routes'));
app.use('/auth', require('./Routes/auth.routes'));
app.use('/stk', require('./Routes/stk.routes'));
app.use('/newsletter', require('./Routes/newsletter.routes'));

//serve static
// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', (req, res) => {
// res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError.NotFound());
});

// error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		status: err.status || 500,
		message: err.message || 'Internal Server Error',
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
