const Discord = require('discord.js');
const { version } = require('../package.json');

module.exports = {
	name: 'ping',
	description: 'Pings the bot!',
	cooldown: 5,
	async execute(message) {
		const sentMessage = await message.channel.send('Pinging...');
		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setTitle(`${message.client.user.username} Ping`)
			.addFields(
				{ name: 'Message Edit Time:', value: `${sentMessage.createdTimestamp - message.createdTimestamp}ms`, inline: true },
				{ name: 'Websocket Heartbeat:', value: `${message.client.ws.ping}ms`, inline: true },
			)
			.setTimestamp()
			.setFooter(`${message.client.user.username} v${version}`, message.client.user.displayAvatarURL({ dynamic: true }));
		sentMessage.edit('', embed);
	},
};