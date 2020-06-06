module.exports = {
	name: 'beep',
	description: 'Beeps the bot!',
	cooldown: 5,
	execute(message) {
		message.channel.send('Boop.');
	},
};