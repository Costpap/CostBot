import { Command } from "../typings/index";
import { clean } from "../utils/misc";
import { Message, Client, TextChannel } from "discord.js";

import * as util from "util";
import * as child_process from "child_process";
const exec = util.promisify(child_process.exec);

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
			|| client.commands.find(cmd => cmd.aliases?.includes(commandName));

		if (!command) {
			return message.channel.send(`❌ There is no command with name or alias \`${commandName}\`!`);
		}
		const sentMessage: Message = await message.channel.send('📝 Compiling TypeScript code...');
		try {
			const { stderr } = await exec('npx tsc');
			if (stderr) throw stderr;
		}
		catch (stderr) {
			console.error('Error compiling TypeScript code: \n', stderr);
			return sentMessage.edit(`❌ There was an error while compiling TypeScript code: \`\`\`js\n${clean(stderr)}\`\`\``);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand: Command = await import(`./${command.name}.js`);
			client.commands.set(newCommand.name, newCommand);
			const coreLog = await client.channels.cache.get(process.env.CORELOG_ID) as TextChannel;
			coreLog.send(`🔁 Command **${command.name}** was reloaded by \`${message.author.tag} (${message.author.id})\`.`);
			sentMessage.edit(`✅ Command **${command.name}** was reloaded!`);
		}
		catch (error) {
			console.error(error);
			sentMessage.edit(`❌ There was an error while reloading command \`${command.name}\`:\n\`\`\`js\n${error.message}\`\`\``);
		}

	},
};