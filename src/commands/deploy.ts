import { clean } from "../utils/misc";
import { Message, Client, TextChannel } from "discord.js";

import { promisify } from "util";
import * as child_process from "child_process";
const exec = promisify(child_process.exec);

export default {
	name: 'deploy',
	description: 'Compiles TypeScript code and then restarts the bot.',
	aliases: ['deployment', 'dep', 'update', 'upd'],
	ownerOnly: true,
	cooldown: 0,
	do: async (message: Message, client: Client) => {
		const coreLog = client.channels.cache.get(process.env.CORELOG_ID) as TextChannel;
		const logMessage: Message = await coreLog.send(`🔃 Deployment initiated by \`${message.author.tag} (${message.author.id})\`.`);
		const depMessage: Message = await message.channel.send('📝 Compiling TypeScript code...');
		const start: number = Date.now();
		try {
			const { stderr } = await exec('npx tsc');
			if (stderr) throw stderr;
		}
		catch (stderr) {
			console.error('Error compiling TypeScript code: \n', stderr);
			logMessage.edit(`${logMessage.content} \n\n❌ Deployment resulted in error.`);
			return depMessage.edit(`❌ There was an error while compiling TypeScript code: \`\`\`js\n${clean(stderr)}\`\`\``);
		}

		const end: number = Date.now();
		const complilationTime: number = (end - start) / 1000;
		const sec: string = complilationTime === 1 ? 'second' : 'seconds';
		await logMessage.edit(`${logMessage.content}\n\n✅ Compiled in ${complilationTime.toFixed(1)} ${sec}.\n\n🔄 Shutting down.`);
		await depMessage.edit(`✅ Compilation finished in ${complilationTime.toFixed(1)} ${sec}. Shutting down...`);
		process.exit();


	},
};