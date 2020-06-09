export default {
	name: 'invite',
	description: 'Sends you a link to invite the bot.',
	aliases: ['inv'],
	cooldown: 5,
	async execute(message) {
		const link = await message.client.generateInvite(['KICK_MEMBERS', 'BAN_MEMBERS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY']);
		message.channel.send(`You can invite ${message.client.user.username} from this link: <${link}>.`);
	},
};