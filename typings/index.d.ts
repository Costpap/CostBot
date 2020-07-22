import * as Discord from 'discord.js';

declare interface Event {
  [key: string]: never
}
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
    do: (message: Discord.Message, client: Discord.Client, args: string[], Discord: typeof import ('discord.js')) => Promise<unknown>
}

declare module 'discord.js' {
  export interface Client {
    events: Discord.Collection<string, Event>
    commands: Discord.Collection<string, Command>
    cooldowns: Discord.Collection<string, unknown>
  }
}