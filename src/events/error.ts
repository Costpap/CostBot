import { Client, EmbedBuilder, version } from 'discord.js';
import { errorLog } from '../utils/logs';

export default {
    name: 'error',
    run: async (client: Client, error: string) => {
        console.error(error);

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`${client.user.username} Client-Emitted Error`)
            .setDescription(`\`\`\`${error}\`\`\``)
            .setTimestamp()
            .setFooter({ text: `Error occurred while running discord.js v${version}.` });

        errorLog('', [embed], client, { noContent: true });
    },
};
