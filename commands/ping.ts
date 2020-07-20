import { version } from '../package.json';

module.exports = {
	name: 'ping',
	description: 'Pings the bot!',
	permissions: ['EMBED_LINKS'],
	cooldown: 8,
	do: async (message, client, args, Discord) => {
		const sentMessage = await message.channel.send('Pinging...');
		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setTitle(`${client.user.username} Ping`)
			.addFields(
				{ name: 'Message Edit Time', value: `${sentMessage.createdTimestamp - message.createdTimestamp}ms`, inline: true },
				{ name: 'Websocket Heartbeat', value: `${client.ws.ping}ms`, inline: true },
			)
			.setTimestamp()
			.setFooter(`${client.user.username} v${version}`, client.user.displayAvatarURL({ format: 'png' }));
		sentMessage.edit('', embed);
	},
};