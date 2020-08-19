import { clean } from "../utils/misc";
import { Message, Client } from "discord.js";

import { promisify, inspect } from "util";
import * as child_process from "child_process";
/**
* @param {string} - The code to execute
*/
const exec = promisify(child_process.exec);


export default {
	name: 'shell',
	description: 'Runs Shell code.',
	ownerOnly: true,
	usage: 'code',
	args: true,
	permissions: ['EMBED_LINKS'],
	do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
		const before: number = Date.now();
		const code: string = args.join(' ');
		try {
			let { stdout } = await exec(code);

			if (typeof stdout !== 'string') {stdout = (await inspect(stdout));}

			if (stdout.length > 1016) {
				console.log('Shell Output:\n', clean(stdout));
				stdout = '"The output cannot be displayed as it is longer than 1024 characters. Please check the console."';
			}

			const embed = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setTitle('Execution Successful')
				.addField('📥 Input', `\`\`\`bash\n${code}\`\`\``)
				.setTimestamp()
				.setFooter(`Execution time: ${Math.round(Date.now() - before)}ms`, client.user.displayAvatarURL({ format: 'png' }));
			if (stdout) {
				embed.addField('🖥 stdout', `\`\`\`bash\n${clean(stdout)}\`\`\``);
			}
			message.channel.send(embed);
		}
		catch (error) {
			console.error('Shell:', error);
			const embed = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('Execution Error')
				.addFields(
					{ name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
					{ name: '❌ Error message', value: `\`\`\`js\n${error.message}\`\`\`` },
				)
				.setTimestamp()
				.setFooter(`Execution time: ${Math.round(Date.now() - before)}ms`, client.user.displayAvatarURL({ format: 'png' }));
			message.channel.send(embed);
		}
	},
};
