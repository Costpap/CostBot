const Discord = require('discord.js');

module.exports = {
	name: 'manageable',
	description: 'Shows if the bot can manage this user or not.',
	aliases: ['mod-able', 'modable'],
	guildOnly: true,
	cooldown: 5,
	execute(message) {
		const member = message.mentions.members.first() || message.member;
		const embed = new Discord.MessageEmbed()
			.setColor(member.displayHexColor)
			.setTitle(`Moderation Status for ${member.user.tag} (${member.id})`)
			.addFields(
				{ name: 'Manageable:', value: member.manageable, inline: true },
				{ name: 'Kickable:', value: member.kickable, inline: true },
				{ name: 'Bannable:', value: member.bannable, inline: true },
			)
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`);

		message.channel.send(embed);
	},
};