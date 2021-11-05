const { SlashCommandBuilder } = require('@discordjs/builders');
const { ALCHEMY_RINKEBY_URL, INFURA_RINKEBY_URL, FROM_ADDRESS, infura } = require('../config.json');
const ethers = require('ethers');
const provider = new ethers.providers.JsonRpcProvider(infura ? INFURA_RINKEBY_URL : ALCHEMY_RINKEBY_URL);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!, configured provider, faucet balance and donation address.'),
	async execute(interaction) {
		let balance;
		try {
			balance = await ethers.utils.formatEther(await provider.getBalance(FROM_ADDRESS));
		}
		catch (e) {
			console.log(e);
			return interaction.reply('Error getting balance. Please check logs.');
		}

		const balanceShort = balance.toString().slice(0, balance.toString().indexOf('.') + 3);
		return interaction.reply(`Pong! Provider: ${infura ? 'Infura' : 'Alchemy'}. Current balance: ${balanceShort} ETH. Please use /faucet to request funds.\nDonate: ${FROM_ADDRESS}`);
	},
};