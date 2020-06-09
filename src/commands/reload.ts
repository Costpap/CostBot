export default {
	name: 'reload',
	description: 'Reloads a command',
	ownerOnly: true,
	args: true,
	aliases: ['cmdr'],
	usage: '[command name]',
	execute({ message, args }: { message: any; args: any; }) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find((cmd: { aliases: string | any[]; }) => {
				return cmd.aliases && cmd.aliases.includes(commandName);
			});

		if (!command) {
			return message.channel.send(`:x: There is no command with name or alias \`${commandName}\`!`);
		}

		delete require.cache[require.resolve(`./${command.name}.ts`)];

		try {
			const newCommand = require(`./${command.name}.ts`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`:white_check_mark: Command \`${command.name}\` was reloaded!`);
		}
		catch (error) {
			console.log(error);
			message.channel.send(`:x: There was an error while reloading a command \`${command.name}\`:\n\`\`\`js \n ${error.message}\`\`\``);
		}
	},
};