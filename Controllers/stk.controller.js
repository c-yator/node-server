const { default: axios } = require('axios');
const createError = require('http-errors');
const events = require('events');

const setAuthHeader = require('../Config/setAuthHeader');
const MobilePayment = require('../Models/MobilePayment.model');
const getTimestamp = require('../Config/getTimestamp');

const eventEmitter = new events.EventEmitter();

module.exports = {
	stk: async (req, res, next) => {
		try {
			console.log('mpesa req ', req.body);
			const { Amount, PhoneNumber, TransactionDesc } = req.body;

			if (!Amount || !PhoneNumber || !TransactionDesc)
				throw createError.BadRequest();

			const LNMpasskey =
				'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';

			const BusinessShortCode = '174379';

			const Password = Buffer.from(
				BusinessShortCode + LNMpasskey + getTimestamp,
				'utf-8'
			).toString('base64');

			const CallBackURL = 'http://240cca69f31f.ngrok.io/stk/callback';
			const AccountReference = 'Yote fresh Groceries';

			const response = await axios({
				method: 'POST',
				url: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
				headers: setAuthHeader(req),
				data: {
					BusinessShortCode,
					Password,
					Timestamp: getTimestamp,
					TransactionType: 'CustomerPayBillOnline',
					Amount,
					PartyA: PhoneNumber,
					PartyB: BusinessShortCode,
					PhoneNumber,
					CallBackURL,
					AccountReference,
					TransactionDesc,
				},
			});
			res.json(response.data);
			console.log('response', response.data);
		} catch (error) {
			console.log(error.response);
			next(error);
		}
	},

	CallBackURL: async (req, res, next) => {
		try {
			console.log(
				'............................. CallBackURL .............................'
			);
			const {
				Body: { stkCallback },
			} = req.body;
			console.log('stkCallback', stkCallback);
			const { ResultCode, ResultDesc } = stkCallback;

			if (ResultCode != 0) {
				throw createError('payment failed : ' + ResultDesc);
			}

			const payment = new MobilePayment(stkCallback);
			const result = await payment.save();
			if (result) {
				req.payId = result._id;
				console.log('transaction was successful');
			}
			console.log('payment saved', result);

			eventEmitter.emit('payment saved');
		} catch (error) {
			console.log(error);
			next(error);
		}
	},
	stkQuery: async (req, res, next) => {
		console.log('called');
		try {
			const LNMpasskey =
				'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
			const BusinessShortCode = '174379';
			const Password = Buffer.from(
				BusinessShortCode + LNMpasskey + getTimestamp,
				'utf-8'
			).toString('base64');
			const { CheckoutRequestID } = req.body;
			const response = await axios({
				method: 'POST',
				url: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
				headers: setAuthHeader(req),
				data: {
					BusinessShortCode,
					Password,
					Timestamp: getTimestamp,
					CheckoutRequestID,
				},
			});
			res.send(response.data);
			console.log('stkQuery response', response.data);
		} catch (err) {
			console.log(err.response.data);
			next(err);
		}
	},
	paymentConfirmation: async (req, res, next) => {
		try {
			res.setHeader('Cache-Control', 'no-cache');
			res.setHeader('Content-Type', 'text/event-stream');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.flushHeaders(); // flush the headers to establish SSE with client

			eventEmitter.on('payment saved', () => {
				console.log('event called');
				res.write(`data: ${JSON.stringify({ payment: true })}\n\n`); // res.write() instead of res.send()
			});
		} catch (error) {
			next(error);
		}
	},
};
