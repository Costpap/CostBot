import { Message, Client, User } from "discord.js";
import { parseUserMention } from "../utils/parse";

export default {
	name: 'unban',
	description: 'Bans the @mentioned user from your server.',
	aliases: ['un-ban'],
	guildOnly: true,
	usage: '@member (optional reason)',
	permissions: ['BAN_MEMBERS'],
	cooldown: 10,
	do: async (message: Message, client: Client, args: string[]) => {
		if (!message.member.hasPermission('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) {
			return message.reply('you need the `Ban Members` permission in order to use this command!');
		}
		const user: User = parseUserMention(args[0], client) || client.users.cache.get(args[0]);
		if (!user) {
			return message.channel.send('❌ You need to specify a user to unban!');
		}
		if (user === message.author) {
			return message.channel.send('How do you unban yourself? 🤔');
		}
		try {
			message.guild.members.unban(user, args.slice(1).join(' '));
			message.channel.send(`✅ Unbanned \`${user.tag} (${user.id})\`.`);
		}
		catch (error) {
			console.error(error);
			message.channel.send(`❌ I encountered an error while trying to unban \`${user.tag}\`: \n\`\`\`${error.message}\`\`\``);
		}

	},
};