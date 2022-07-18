import { Client, Collection } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder;
    run: (interaction: ChatInputCommandInteraction, client: Client) => Promise<void>;
}

export interface LogChannel {
    id: string;
    webhookId: string;
    token: string;
}

declare module 'discord.js' {
    export interface Client {
        events: Collection<string, unknown>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        commands: Collection<string, any>;
    }
}
