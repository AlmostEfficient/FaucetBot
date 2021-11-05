/* eslint-disable no-inline-comments */
const { INFURA_RINKEBY_URL, PRIVATE_KEY, FROM_ADDRESS, maxFeePerGas: MAX_GAS } = require('../config.json');
const axios = require('axios');
const ethers = require('ethers');
const { default: Common, Chain, Hardfork } = require('@ethereumjs/common')
const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx');
const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })

const provider = new ethers.providers.JsonRpcProvider(INFURA_RINKEBY_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

module.exports = async (toAddress, amount) => {
	console.log('Received new request from ', toAddress, 'for', amount)
	if (!PRIVATE_KEY || !FROM_ADDRESS || !INFURA_RINKEBY_URL) {
		return { status: 'error', message: 'Missing environment variables, please ask human to set them up.' };
	}
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		const balance = ethers.utils.formatEther(await provider.getBalance(FROM_ADDRESS));
		if (balance < parseFloat(amount)) {
			reject ({ status: 'error', message: `I'm out of funds! Please donate: ${FROM_ADDRESS}` });
		}
		const nonce = await wallet.getTransactionCount();
		const amountInWei = ethers.utils.parseEther(amount);
		const txData = {
			'data': '0x', // Changing this will cost you 4 gas for a zero byte, 68 gas for non-zeros
			'gasLimit': '0x5208', // 21000
			'maxPriorityFeePerGas': 65000000000, // 65 gwei
			'maxFeePerGas': MAX_GAS, // priorityFeePerGas + max base fee
			'nonce': nonce,
			'to': toAddress,
			'value': amountInWei._hex,
			'chainId': '0x04',
			'accessList': [],
			'type': '0x02',
		}

		const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
		const privateKey = Buffer.from(wallet.privateKey.slice(2), 'hex');
		const signedTx = await tx.sign(privateKey);
		const serializedTx = signedTx.serialize();
		const rawTx = '0x' + serializedTx.toString('hex');

		try {
			const response = await axios.post(INFURA_RINKEBY_URL, {
				method: 'eth_sendRawTransaction',
				params: [rawTx],
				id: 1,
				jsonrpc: '2.0',
			});
			if (response.data.result) {
				console.log('Tx created: https://rinkeby.etherscan.io/tx/' + response.data.result);
				resolve({ status: 'success', message: response.data.result });
			}
			else {
				console.log('Error in infura call:', response.data)
				reject({ status: 'error', message: response.data || 'Something went wrong. Error not found, please check logs' });
			}
		}
		catch (error) {
			console.log(error);
			return { status: 'error', message: 'Unable to make call to infura node. Please check logs.' };
		}
	})
}