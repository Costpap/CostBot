import { clientStats, version } from '../utils/misc';
import { Client, Message, MessageEmbed } from 'discord.js';

export default {
    name: 'stats',
    description: 'Displays statistics about this bot.',
    aliases: ['statistics', 'uptime'],
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, client: Client) => {
        const embed = new MessageEmbed()
            .setColor(0x6293f5)
            .setTitle(`${client.user.username} Statistics`)
            .setTimestamp()
            .setFooter(`${client.user.username} ${await version()}`, client.user.displayAvatarURL({ format: 'png' }));
        clientStats(embed, client, { membersExcludingBots: true });
        message.channel.send(embed);
    },
};
