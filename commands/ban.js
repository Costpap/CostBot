module.exports = {
	name: 'ban',
	description: 'Bans the @mentioned user from your server.',
	guildOnly: true,
	usage: '@member (optional reason)',
	permissions: ['BAN_MEMBERS'],
	cooldown: 10,
	do: async (message, args) => {
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

			message.guild.members.ban(user, { reason: args.slice(1).join(' ') });
			message.channel.send(`:hammer: Banned \`${user.tag} (${user.id})\`.`);
		}
		catch (error) {
			console.error(error);
			message.reply(`:x: I encountered an error while trying to ban \`${user.tag}\`: \n\`\`\`${error.message}\`\`\``);
		}

	},
};