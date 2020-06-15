module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	ownerOnly: true,
	args: true,
	aliases: ['cmdr'],
	usage: '[command name]',
	do: (message, args) => {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`:x: There is no command with name or alias \`${commandName}\`!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`:white_check_mark: Command \`${command.name}\` was reloaded!`);
		}
		catch (error) {
			console.log(error);
			message.channel.send(`:x: There was an error while reloading a command \`${command.name}\`:\n\`\`\`js \n ${error.message}\`\`\``);
		}
	},
};