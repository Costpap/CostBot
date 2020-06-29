module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	args: true,
	usage: 'argument(s)',
	permissions: ['EMBED_LINKS'],
	cooldown: 5,
	do: async (message, client, args, Discord) => {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}
		if (args[0] === 'eri') {
			return message.channel.send('eri');
		}
		if (args[0] === 'Dom') {
			return message.channel.send('dommy');
		}
		if (args[0] === 'suspense') {
			return message.channel.send('spense');
		}
		if (args[0] === 'Costpap') {
			return message.channel.send('God');
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.addFields(
				{ name: 'Arguments', value: args.join(' ') },
				{ name: 'Total length', value: args.length },
			)
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', dynamic: true }));
		message.channel.send(embed);
	},
};