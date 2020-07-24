import { Command } from '../typings/index.js';
import { Message, Client, TextChannel } from 'discord.js';

export default {
	name: 'reload',
	description: 'Reloads a command.',
	ownerOnly: true,
	args: true,
	aliases: ['cmdr'],
	usage: '[command name]',
	do: async (message: Message, client: Client, args: string[]) => {
		const commandName: string = args[0].toLowerCase();
		const command: Command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`❌ There is no command with name or alias \`${commandName}\`!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand: Command = await import(`./${command.name}.js`);
			client.commands.set(newCommand.name, newCommand);
			const coreLog = await client.channels.cache.get(process.env.CORELOG_ID) as TextChannel;
			coreLog.send(`🔁 Command **${command.name}** was reloaded by \`${message.author.tag} (${message.author.id})\`.`);
			message.channel.send(`✅ Command **${command.name}** was reloaded!`);
		}
		catch (error) {
			console.error(error);
			message.channel.send(`❌ There was an error while reloading command \`${command.name}\`:\n\`\`\`js\n${error.message}\`\`\``);
		}
	},
};