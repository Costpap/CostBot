module.exports = {
	name: 'reload',
	description: 'Reloads a command.',
	ownerOnly: true,
	args: true,
	aliases: ['cmdr'],
	usage: '[command name]',
	do: async (message, client, args) => {
		const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`❌ There is no command with name or alias \`${commandName}\`!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			client.commands.set(newCommand.name, newCommand);
			message.channel.send(`✅ Command \`${command.name}\` was reloaded!`);
		}
		catch (error) {
			console.error(error);
			message.channel.send(`❌ There was an error while reloading command \`${command.name}\`:\n\`\`\`js\n${error.message}\`\`\``);
		}
	},
};