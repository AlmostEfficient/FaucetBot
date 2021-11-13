const { SlashCommandBuilder } = require('@discordjs/builders');
const { ETHERSCAN_API_KEY, watchlist } = require('../config.json');
const ethers = require('ethers');
const { MessageEmbed } = require('discord.js');

const provider = new ethers.providers.EtherscanProvider('rinkeby', ETHERSCAN_API_KEY)

async function getLastTx(address, hours = 12) {
	const block = await provider.getBlockNumber()
	const blockTime = 15;

	const blockMinusHour = block - (1 * 60 * 60 / blockTime);
	const blockMinusArg = block - (hours * 60 * 60 / blockTime);
	let history = await provider.getHistory(address, blockMinusHour, block);
	(history.length === 0 ? history = await provider.getHistory(address, blockMinusArg, block) : null);

	if (history.length === 0) {
		return null;
	}
	else {
		return history[history.length - 1].timestamp;
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Creates report of configured faucets.'),
	async execute(interaction) {
		await interaction.reply('Checking status')
		// For each watched address, get the date of the last transaction
		const transactions = await Promise.all(watchlist.map(async item => {
			const timestamp = await getLastTx(item.address)
			const minutesAgo = (timestamp ?
				(Math.floor((new Date().getTime() / 1000 - timestamp) / 60)) + ' minute(s) ago'
				:
				'No transactions in the last 12 hours'
			);
			return {
				label: item.label,
				url: item.url,
				timestamp: minutesAgo,
			}
		}))
		const embed = new MessageEmbed()
			.setTitle('Last faucet transactions')
			.setColor('#0099ff')
			.setTimestamp()
			.setFooter('Powered by Etherscan')
			.setDescription(transactions.map(({ label, url, timestamp }) => `[${label}](${url}): ${timestamp}`).join('\n'))

		return interaction.followUp({ embeds: [embed] })
	},
};