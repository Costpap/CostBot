import { Message, Client } from 'discord.js';

export default {
    name: 'invite',
    level: 'user',
    description: 'Sends you a link to invite the bot.',
    aliases: ['inv'],
    cooldown: 5,
    do: async (message: Message, client: Client) => {
        const link: string = await client.generateInvite([
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'MANAGE_MESSAGES',
            'EMBED_LINKS',
            'READ_MESSAGE_HISTORY',
        ]);
        message.channel.send(`You can invite me to your server from this link: <${link}>.`);
    },
};
