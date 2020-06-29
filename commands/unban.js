module.exports = {
	name: 'unban',
	description: 'Bans the @mentioned user from your server.',
	aliases: ['un-ban'],
	guildOnly: true,
	usage: '@member (optional reason)',
	permissions: ['BAN_MEMBERS'],
	cooldown: 10,
	do: async (message, args) => {
		if (!message.member.hasPermission('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) {
			return message.reply('you need the `Ban Members` permission in order to use this command!');
		}
		if (!args.length) {
			return message.reply('you need to provide the ID of a user to unban!');
		}
		if (args[0] === message.author.id) {
			return message.channel.send('How do you unban yourself? :thinking:');
		}
		try {
			message.guild.members.unban(args[0], [(args.slice(1).join(' '))]);
			message.channel.send(`✅ Unbanned \`${args[0]}\`.`);
		}
		catch (error) {
			console.error(error);
			message.reply(`❌ I encountered an error while trying to unban \`${args[0]}\`: \n\`\`\`${error.message}\`\`\``);
		}

	},
};