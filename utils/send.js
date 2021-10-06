const { ALCHEMY_RINKEBY_URL, PRIVATE_KEY, ADDRESS: FROM_ADDRESS, amount: SEND_AMOUNT } = require('../config.json');
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(ALCHEMY_RINKEBY_URL)

module.exports = async (toAddress, amount = SEND_AMOUNT) => {
	console.log('Received new request from ', toAddress, 'for', amount)
	if (!PRIVATE_KEY || !FROM_ADDRESS || !ALCHEMY_RINKEBY_URL) {
		return { status: 'error', message: 'Missing environment variables, please ask human to set them up.' };
	}
	const balance = web3.utils.fromWei(await web3.eth.getBalance(FROM_ADDRESS), 'ether')
	if (balance < parseInt(amount)) {
		return { status: 'error', message: `I'm out of funds! Please donate: ${FROM_ADDRESS}` };
	}
	const nonce = await web3.eth.getTransactionCount(FROM_ADDRESS, 'latest');
	const amountInWei = web3.utils.toWei(amount);
	const transaction = {
		'to': toAddress,
		'value': amountInWei,
		'gas': 30000,
		'maxFeePerGas': 1000000108,
		'nonce': nonce,
	};

	const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

	return new Promise((resolve, reject) => {
		try {
			web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
				if (!error) {
					resolve({ status: 'success', message: hash });
				}
				else {
					console.log(error);
					reject({ status: 'error', message: error });
				}
			});
		}
		catch (error) {
			console.log(error);
			reject({ status: 'error', message: error });
		}
	});
}