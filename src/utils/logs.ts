import type { LogChannel } from '../typings';
import { Client } from 'discord.js';

const send = (client: Client, config: LogChannel, input: string) => {
    if (!config || !config.id || !config.token) return;
};
