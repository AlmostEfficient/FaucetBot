const { ALCHEMY_RINKEBY_URL, PRIVATE_KEY, FROM_ADDRESS, maxFeePerGas: MAX_GAS } = require('../config.json');
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(ALCHEMY_RINKEBY_URL)

module.exports = async (toAddress, amount) => {
	console.log('Received new request from ', toAddress, 'for', amount)
	if (!PRIVATE_KEY || !FROM_ADDRESS || !ALCHEMY_RINKEBY_URL) {
		return ({ status: 'error', message: 'Missing environment variables, please ask human to set them up.' });
	}
	// eslint-disable-next-line no-async-promise-executor
	return new Promise (async (resolve, reject) => {
		const balance = web3.utils.fromWei(await web3.eth.getBalance(FROM_ADDRESS), 'ether')
		if (balance < parseFloat(amount)) {
			reject({ status: 'error', message: `I'm out of funds! Please donate: ${FROM_ADDRESS}` });
		}
		const nonce = await web3.eth.getTransactionCount(FROM_ADDRESS, 'latest');
		const amountInWei = web3.utils.toWei(amount);
		const transaction = {
			'to': toAddress,
			'value': amountInWei,
			'gas': 30000,
			'maxFeePerGas': MAX_GAS,
			'nonce': nonce,
		};

		const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
		web3.eth.sendSignedTransaction(signedTx.rawTransaction)
			.on('transactionHash', (hash) => {
				console.log('Transaction: https://rinkeby.etherscan.io/tx/' + hash);
				resolve({ status: 'success', message: hash });
			})
			.on('error', (error) => {
				console.log('error: ', error)
				reject({ status: 'error', message: error });
			});
	});
}