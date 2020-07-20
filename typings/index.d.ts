import * as Discord from 'discord.js';

declare interface Command {
    name: string,
    description?: string,
    aliases?: string[],
    disabled?: boolean,
    args?: boolean,
    guildOnly?: boolean,
    adminOnly?: boolean,
    ownerOnly?: boolean,
    usage?: string,
    permissions?: string[],
    cooldown?: number
    do: (message: unknown, client: unknown, args: string[], Discord: typeof module) => Record<string, unknown>
}

declare module 'discord.js' {
  export interface Client {
    events: Discord.Collection<string, unknown>
    commands: Discord.Collection<string, Command>
    cooldowns: Discord.Collection<string, unknown>
  }
}