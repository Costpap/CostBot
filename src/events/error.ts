import { errorLog } from '../utils/logs';
import { Client, MessageEmbed, version } from 'discord.js';

export default {
    name: 'error',
    do: async (error: string, client: Client) => {
        console.error(error);

        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle(`${client.user.username} Client-Emitted Error`)
            .setDescription(`\`\`\`${error}\`\`\``)
            .setTimestamp()
            .setFooter(`Error occurred while running discord.js v${version}.`);

        errorLog(embed, client, { noWebhook: true });
    },
};
