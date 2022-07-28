import { Client } from 'discord.js';
import { errorLog } from '../utils/logs';
import { generateBasicErrorEmbed } from '../utils/misc';

export default {
    name: 'error',
    run: async (client: Client, error: string) => {
        console.error(error);

        const embed = await generateBasicErrorEmbed(`${client.user.username} Client-Emitted Error`, 'Red', error);

        errorLog('', [embed], client, { noContent: true });
    },
};
