import { Message, Client, GuildMember } from "discord.js";
import { parseMemberMention } from "../utils/parse";

export default {
	name: 'kick',
	description: 'Kicks the @mentioned user from your server.',
	guildOnly: true,
	args: true,
	usage: '@member (optional reason)',
	permissions: ['KICK_MEMBERS'],
	cooldown: 10,
	do: async (message: Message, client: Client, args: string[]) => {
		if (!message.member.hasPermission('KICK_MEMBERS', { checkAdmin: true, checkOwner: true })) {
			return message.reply('you need the `Kick Members` permission in order to use this command!');
		}
		const member: GuildMember = parseMemberMention(args[0], message.guild)
		|| message.guild.members.cache.get(args[0]);
		if (!member) {
			return message.channel.send('❌ You need to specify a user to kick!');
		}
		if (member === message.member) {
			return message.channel.send("Aww, please don't kick yourself! 💖");
		}
		if (member.kickable === false) {
			return message.channel.send('❌ I cannot kick this user! \n**Please make sure that my highest role is above theirs.**');
		}
		try {

			member.kick(args.slice(1).join(' '));
			message.channel.send(`🔨 Kicked \`${member.user.tag} (${member.id})\`.`);
		}
		catch (error) {
			console.error(error);
			message.channel.send(`❌ I encountered an error while trying to kick \`${member.user.tag}\`: \n\`\`\`${error.message}\`\`\``);
		}

	},
};