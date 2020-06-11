module.exports = {
	name: 'shut-down',
	description: 'Shuts down the bot.',
	aliases: ['shutdown', 'shdn', 'restart', 'rst', 'reboot', 'rbt'],
	ownerOnly: true,
	cooldown: 60,
	execute(message) {
		console.log(`Shutdown initiated by ${message.author.tag}.`),
		message.channel.send(':white_check_mark: Shutting down...')
			.then(() => process.exit());
	},
};