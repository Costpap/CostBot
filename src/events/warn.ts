import { Client } from 'discord.js';
import { errorLog } from '../utils/logs';
import { generateBasicErrorEmbed } from '../utils/misc';

export default {
    name: 'warn',
    run: async (client: Client, warning: string) => {
        console.warn(warning);

        const embed = await generateBasicErrorEmbed(
            `${client.user.username} Client-Emitted Warning`,
            'Yellow',
            warning,
        );

        errorLog('', [embed], client, { noContent: true });
    },
};
