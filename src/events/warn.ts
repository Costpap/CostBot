import { errorLog } from '../utils/logs';
import { Client } from 'discord.js';

export default async (_Discord: typeof import('discord.js'), client: Client, warning: string) => {
    console.warn(warning);
    errorLog(warning, client);
};
