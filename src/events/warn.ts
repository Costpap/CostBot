import { Client, EmbedBuilder, version } from 'discord.js';
import { errorLog } from '../utils/logs';

export default {
    name: 'warn',
    run: async (client: Client, warning: string) => {
        console.warn(warning);

        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle(`${client.user.username} Client-Emitted Warning`)
            .setDescription(`\`\`\`${warning}\`\`\``)
            .setTimestamp()
            .setFooter({ text: `Warning occurred while running discord.js v${version}.` });

        errorLog('', [embed], client, { noContent: true });
    },
};
