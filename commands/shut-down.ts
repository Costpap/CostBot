module.exports = {
	name: 'shut-down',
	description: 'Shuts down the bot.',
	aliases: ['shutdown', 'shdn', 'restart', 'rst', 'reboot', 'rbt'],
	ownerOnly: true,
	cooldown: 60,
	do: async (message, client) => {
		const coreLog = await client.channels.cache.get(process.env.CORELOG_ID);
		coreLog.send(`🔄 Shutdown initiated by \`${message.author.tag} (${message.author.id})\`.`);
		console.log(`Shutdown initiated by ${message.author.tag} (${message.author.id}).`),
		await message.channel.send('✅ Shutting down...');
		process.exit();
	},
};