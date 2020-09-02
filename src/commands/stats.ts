import { clientStats, version } from '../utils/misc';
import { Message, Client } from 'discord.js';

export default {
    name: 'stats',
    description: 'Displays statistics about this bot.',
    aliases: ['statistics', 'uptime'],
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
        const embed = new Discord.MessageEmbed()
            .setColor('#6293f5')
            .setTitle(`${client.user.username} Statistics`)
            .setTimestamp()
            .setFooter(`${client.user.username} ${await version()}`, client.user.displayAvatarURL({ format: 'png' }));
        clientStats(embed, client);
        message.channel.send(embed);
    },
};
