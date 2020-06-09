export default {
	name: 'mute',
	description: 'Mutes the @mentioned user in your server.',
	disabled: true,
	guildOnly: true,
	cooldown: 10,
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to mute them!');
		}

		// eslint-disable-next-line no-unused-vars
		const member = message.mentions.members.first();
		message.channel.send(':warning: This command has been temporarily disabled.');
	},
};