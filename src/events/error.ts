import { errorLog } from '../utils/logs';
import { Client, version } from 'discord.js';

export default {
    name: 'error',
    do: async (error: string, client: Client, Discord: typeof import('discord.js')) => {
        console.error(error);

        const embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle(`${client.user.username} Client-Emitted Error`)
            .setDescription(`\`\`\`${error}\`\`\``)
            .setTimestamp()
            .setFooter(`Error occurred while running discord.js v${version}.`);

        errorLog(embed, client, { noWebhook: true });
    },
};
