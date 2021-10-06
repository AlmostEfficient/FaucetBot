const { Client, Collection, Intents } = require('discord.js');
const { token, cooldown } = require('./config.json');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const Keyv = require('keyv');
const keyv = new Keyv();

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	// Rate limiting and cooldowns for faucet requests
	if (command.data.name === 'faucet') {
		// If the last transaction was less than 10 seconds ago, disallow to prevent nonce reuse (no concurrent transactions ATM)
		if (await keyv.get('lastTx') > Date.now() - 10000) {
			return interaction.reply('Please wait 10 seconds between requests to prevent nonce issues.');
		}

		const lastRequested = await keyv.get(interaction.user.id);
		if (lastRequested) {
			if (Date.now() - lastRequested < cooldown) {
				return interaction.reply('You can only request funds once every 60 minutes.');
			}
		}
	}

	try {
		await command.execute(interaction);
		if (command.data.name === 'faucet') {
			await keyv.set(interaction.user.id, Date.now());
			await keyv.set('lastTx', Date.now());
		}
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);