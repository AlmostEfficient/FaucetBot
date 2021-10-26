const { SlashCommandBuilder } = require('@discordjs/builders');
const { ALCHEMY_RINKEBY_URL, ADDRESS: FROM_ADDRESS } = require('../config.json');
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(ALCHEMY_RINKEBY_URL)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const balance = web3.utils.fromWei(await web3.eth.getBalance(FROM_ADDRESS), 'ether');
		const balanceShort = balance.toString().slice(0, balance.toString().indexOf('.') + 3);
		return interaction.reply(`Pong! Current balance: ${balanceShort} ETH. Please use /faucet to request funds.\nDonate: ${FROM_ADDRESS}`);
	},
};