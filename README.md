# FaucetBot
This is a Discord bot that dispenses Rinkeby ETH. 

Features:
* Full control over the wallet
* Customisable funding amount (0.1 ETH by default)
* No concurrent requests to prevent failed transactions due to nonce issues
* Customisable per user cooldowns (1 hour by default)
* Balance check and donation alert

![image](https://user-images.githubusercontent.com/42661870/136471444-b91a48f6-bc66-48ed-b502-d51a65156c59.png)

# Requirements
* Yarn
* Node.js > 16.6.0

# Setup
* Register an application and get a token [from here](https://discord.com/developers/applications)
* Rename the `scheme.config.json` file to `config.json`
* Add the bot token, Alchemy URL, wallet keys, and the guild/client IDs to the `config.json` file 
Note: The client ID is the application ID of the bot. You can get this from the application page or by right-clicking the bot and selecting "Copy ID". 
The guild ID is the ID of the server you want the bot to be in. You can get this by right-clicking the server and selecting "Copy ID".

* Install with
```bash
yarn install
```
* Run `node deploy-commands.js` to [register your slash commands](https://discordjs.guide/interactions/registering-slash-commands.html#guild-commands).
Note: Deploy is at guild level by default. You can change this by updating the `deploy-commands.js` file. 
# Usage
* Start the bot with
```bash
node .
```
* Use `/faucet <address>` to request funds.

# Config
You can change the following: 
* Cooldown time: Update the `cooldown` value in the `config.json` file with a value in milliseconds. Defaults to `3600000` (1 hour).
* Amount: Update the `amount` value in the `config.json` file with a string. Defaults to `0.1` ETH.
