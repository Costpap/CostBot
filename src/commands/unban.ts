export default {
	name: 'unban',
	description: 'Bans the @mentioned user from your server.',
	aliases: 'un-ban',
	guildOnly: true,
	usage: '@member (optional reason)',
	cooldown: 10,
	execute({ message, args }: { message: any; args: any; }) {

		if (!message.member.hasPermission('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) {
			return message.reply('You need the `Ban Members` permission in order to use this command!');
		}
		try {
			const messageArgs = args.slice(0);
			message.guild.members.unban(args[0], [(messageArgs.slice(1).join(' '))]);
			message.channel.send(`:white_check_mark: Unbanned \`${args[0]}\`.`);
		}
		catch (error) {
			console.error(error);
			message.reply(`:x: I encountered an error while trying to unban \`${args[0]}\`: \n\`\`\`${error.message}\`\`\``);
		}

	},
};