import { Message, Client, TextChannel } from 'discord.js';

export default {
	name: 'shut-down',
	description: 'Shuts down the bot.',
	aliases: ['shutdown', 'shdn', 'restart', 'rst', 'reboot', 'rbt'],
	ownerOnly: true,
	cooldown: 0,
	do: async (message: Message, client: Client) => {
		const coreLog = client.channels.cache.get(process.env.CORELOG_ID) as TextChannel;
		coreLog.send(`🔄 Shutdown initiated by \`${message.author.tag} (${message.author.id})\`.`);
		console.log(`Shutdown initiated by ${message.author.tag} (${message.author.id}).`),
		await message.channel.send('✅ Shutting down...');
		process.exit();
	},
};