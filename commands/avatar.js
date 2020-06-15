module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the mentioned user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	cooldown: 5,
	do: async (message) => {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true })}`;
		});

		message.channel.send(avatarList);
	},
};