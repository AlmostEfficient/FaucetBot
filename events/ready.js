const { activityType, activityName } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity(activityName, { type: activityType });
	},
};
