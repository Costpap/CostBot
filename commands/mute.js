module.exports = {
	name: 'mute',
	description: 'Mutes the @mentioned user in your server.',
	disabled: true,
	args: true,
	guildOnly: true,
	cooldown: 10,
	do: (message) => {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to mute them!');
		}
	},
};