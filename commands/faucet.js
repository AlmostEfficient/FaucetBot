const { SlashCommandBuilder } = require('@discordjs/builders');
const isAddress = require('../utils/address.js');
const sendEther = require('../utils/send.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('faucet')
		.setDescription('Request testnet funds from the faucet')
		.addStringOption(option =>
			option.setName('address')
				.setDescription('The address to request funds from the faucet')
				.setRequired(true)),
	async execute(interaction) {
		const address = interaction.options.get('address').value.trim();

		if (!isAddress(address)) {
			return interaction.reply('Please enter a valid Ethereum Address');
		}
		await	interaction.reply('Requesting funds from the faucet...');
		// The second parameter is the amount, passed as a string. Defaults to '0.1' if not passed.
		const tx = await sendEther(address)
		if (tx.status === 'success') {
			return interaction.followUp(`Successfully sent 0.1 ETH. Tx Hash: ${tx.message}`)
		}
		else {
			return interaction.followUp(`Failed to send funds. Error: ${tx.message}`);
		}
	},
};