import { errorLog } from '../utils/logs';
import { Client, MessageEmbed, version } from 'discord.js';

export default {
    name: 'warn',
    do: async (warning: string, client: Client) => {
        console.warn(warning);

        const embed = new MessageEmbed()
            .setColor('YELLOW')
            .setTitle(`${client.user.username} Client-Emitted Warning`)
            .setDescription(`\`\`\`${warning}\`\`\``)
            .setTimestamp()
            .setFooter(`Warning occurred while running discord.js v${version}.`);

        errorLog(embed, client, { noWebhook: true });
    },
};
