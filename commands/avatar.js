const Discord = require("discord.js");

module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the mentioned user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	cooldown: 5,
	execute(message) {
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