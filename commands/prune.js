module.exports = {
	name: 'prune',
	description: 'Prune up to 99 messages.',
	aliases: ['purge', 'delete', 'remove'],
	usage: '[number of messages]',
	args: true,
	guildOnly: true,
	cooldown: 10,
	do: async (message, args) => {
		if (!message.member.hasPermission('MANAGE_MESSAGES', { checkAdmin: true, checkOwner: true })) {
			return message.reply('You need the `Manage Messages` permission in order to use this command!');
		}
		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.reply(':x: that doesn\'t seem to be a valid number.');
		}
		else if (amount <= 1 || amount > 100) {
			return message.reply(':x: you need to input a number between 1 and 99.');
		}
		try {
			message.channel.bulkDelete(amount, true);
			const sentMessage = await message.channel.send(`:white_check_mark: Pruned \`${amount - 1}\` messages.`);
			sentMessage.delete({ timeout: 5000 });
		}
		catch (error) {
			// console.error(error);
			message.reply(`:x: I encountered an error while trying to prune messages in this channel: \n\`\`\`${error.message}\`\`\``);
		}
	},
};