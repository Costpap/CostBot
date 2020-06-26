module.exports = {
	name: 'avatar',
	description: 'Get the avatar of the mentioned user or yourself.',
	aliases: ['icon', 'pfp'],
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	do: async (message, Discord) => {
		const user = message.mentions.users.first() || message.author;
		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(user.tag, user.displayAvatarURL({ format: 'png', dynamic: true }))
			.setDescription(`[Click here for URL](${user.displayAvatarURL({ format: 'png', dynamic: true })})`)
			.setImage(user.displayAvatarURL({ format: 'png', dynamic: true }))
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', dynamic: true }));

		message.channel.send(embed);
	},
};