import { Client } from 'discord.js';
import { coreLog } from '../utils/logs';

export default {
    name: 'ready',
    run: async (client: Client) => {
        coreLog(
            `🆗 Logged in with **${client.users.cache.size}** users across **${client.guilds.cache.size}** guilds!`,
            [],
            client,
            { noWebhook: true },
        );
        console.log(`Logged in as ${client.user.tag} (${client.user.id})!`);
    },
};
