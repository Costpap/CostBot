module.exports = {
	name: 'kick',
	description: 'Kicks the @mentioned user from your server.',
	guildOnly: true,
	args: true,
	usage: '@member (optional reason)',
	cooldown: 10,
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}

		if (!message.member.hasPermission('KICK_MEMBERS', { checkAdmin: true, checkOwner: true })) {
			return message.reply('you need the `Kick Members` permission in order to use this command!');
		}
		const member = message.mentions.members.first();
		if (member.kickable === false) {
			return message.channel.send(':x: I cannot kick this user! \n**Please make sure that my highest role is above theirs.**');
		}
		try {
			const messageArgs = args.slice(0);
			member.kick([(messageArgs.slice(1).join(' '))]);
			message.channel.send(`:hammer: Kicked \`${member.user.tag} (${member.id})\`.`);
		}
		catch (error) {
			console.error(error);
			message.reply(`:x: I encountered an error while trying to kick \`${member.user.tag}\`: \n\`\`\`${error.message}\`\`\``);
		}

	},
};