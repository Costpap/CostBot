import { errorLog } from '../utils/logs';
import { Client } from 'discord.js';

export default async (Discord: typeof import('discord.js'), client: Client, error: string) => {
    console.error(error);
    errorLog(error, client);
};
