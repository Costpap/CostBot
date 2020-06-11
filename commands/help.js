const Discord = require('discord.js');
const { version } = require('../package.json');
const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands', 'cmds'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const { commands } = message.client;

		if (!args.length) {
			const embed = new Discord.MessageEmbed()
			.setColor('#6293f5')
			.setAuthor(`${message.client.user.username} Help`, message.client.user.displayAvatarURL({ format: 'png', dynamic: true }))
			.setTitle('Here\'s a list of all my commands:')
			.setDescription(commands.map(command => command.name).join(', '))
			.setTimestamp()
			.setFooter(`You can send "${prefix}help [command name]" to get info on a specific command!`)

			return message.author.send(embed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag} (${message.author.id}):\n`, error);
					message.reply('I can\'t DM you. **Please make sure that you have DMs enabled.**');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}


		const embed = new Discord.MessageEmbed();
		embed.setColor('#6293f5');
		embed.setTitle(`**Command Name:** ${command.name}`);
		if (command.disabled) {
			embed.setDescription(':warning: This command is currently **disabled**.');
		}
		command.aliases ? embed.addField(command.aliases.length > 1 ? 'Aliases:' : 'Alias:', command.aliases.join(', ')) : '';
		if (command.description) {
			embed.addField('Description:', command.description);
		}
		if (command.ownerOnly) {
			embed.addField('Permission level:', 'Bot Owner')
		}
		if (command.adminOnly) {
			embed.addField('Permission level:', 'Bot Administrator')
		}
		if (command.usage) {
			embed.addField('Usage:', `${prefix}${command.name} ${command.usage}`);
		}
		embed.addField('Cooldown:', `${command.cooldown || 3} second(s)`);
		embed.setTimestamp();
		embed.setFooter(`${message.client.user.username} v${version}`, message.client.user.displayAvatarURL({ format: 'png', dynamic: true }));

		message.channel.send(embed);
	},
};