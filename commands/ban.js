module.exports = {
	name: 'ban',
	description: 'Bans the @mentioned user from your server.',
	guildOnly: true,
	usage: '@member (optional reason)',
	cooldown: 10,
	do: (message, args) => {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to ban them!');
		}

		if (!message.member.hasPermission('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) {
			return message.reply('You need the `Ban Members` permission in order to use this command!');
		}
		const user = message.mentions.users.first();
		if (user === message.author) {
			return message.reply('please don\'t ban yourself!');
		}
		if (user.bannable === false) {
			return message.channel.send(':x: I cannot ban this user! \n**Please make sure that my highest role is above theirs.**');
		}
		try {
			const messageArgs = args.slice(0);
			message.guild.members.ban(user, { reason: messageArgs.slice(1).join(' ') });
			message.channel.send(`:hammer: Banned \`${user.tag} (${user.id})\`.`);
		}
		catch (error) {
			console.error(error);
			message.reply(`:x: I encountered an error while trying to ban \`${user.tag}\`: \n\`\`\`${error.message}\`\`\``);
		}

	},
};