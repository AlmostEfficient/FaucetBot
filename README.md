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
# or with PM2 (recommended)
pm2 start index.js 
```
I highly recommend a process manager such as [PM2](https://pm2.keymetrics.io/) or [forever](https://github.com/foreversd/forever) to make sure the bot stays up.
* Use `/faucet <address>` to request funds.
* Use `/ping` to get balance and donation address.

# Config
You can change the following in the `config.json` file: 
* `cooldown`: Wait time between requests per user. Takes a value in milliseconds. Set to `3600000` (1 hour) by default.
* `amount`: how much to fund per request. Takes a string value. Set to `"0.1"` ETH by default.
* `maxFeePerGas`: The maximum price (in wei) per unit of gas for transaction. Takes in a BigNumber. Set to `25000000000` (25 gwei) by default.
* `activityType`: Discord activity for the bot. Options - `PLAYING`, `STREAMING`, `LISTENING`, `WATCHING`. Set to `WATCHING` by default.
* `activityName`: Name of the activity. Set to `"Buildspace.so"` by default. This shows as "Watching Buildspace.so" in the bot's presence.
* `approvedRoles`: Role IDs for roles that do not have a cooldown (i.e. no waiting 1 hour b/w requests). Takes in an array of strings.