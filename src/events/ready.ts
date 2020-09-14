import { coreLog } from '../utils/logs';
import { Client } from 'discord.js';

export default async (Discord: typeof import('discord.js'), client: Client) => {
    coreLog(
        `🆗 Logged in with **${client.users.cache.size}** users across **${client.guilds.cache.size}** guilds!`,
        client,
        { noWebhook: true },
    );
    console.log(`Logged in as ${client.user.tag} (${client.user.id})!`);
};
