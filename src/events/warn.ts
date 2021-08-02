import { errorLog } from '../utils/logs';
import { Client, version } from 'discord.js';

export default {
    name: 'warn',
    do: async (warning: string, client: Client, Discord: typeof import('discord.js')) => {
        console.warn(warning);

        const embed = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setTitle(`${client.user.username} Client-Emitted Warning`)
            .setDescription(`\`\`\`${warning}\`\`\``)
            .setTimestamp()
            .setFooter(`Warning occurred while running discord.js v${version}.`);

        errorLog(embed, client, { noWebhook: true });
    },
};
