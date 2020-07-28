import { Message, Client, GuildMember } from 'discord.js';

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
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}
		const member: GuildMember = message.mentions.members.first();
		if (member === message.member) {
			return message.reply('please don\'t kick yourself!');
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
			message.reply(`❌ I encountered an error while trying to kick \`${member.user.tag}\`: \n\`\`\`${error.message}\`\`\``);
		}

	},
};