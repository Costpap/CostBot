import * as Discord from 'discord.js';

export interface Event {
  [key: string]: never
}
export interface Command {
    name: string,
    description?: string,
    aliases?: string[],
    disabled?: boolean,
    args?: boolean,
    guildOnly?: boolean,
    adminOnly?: boolean,
    ownerOnly?: boolean,
    usage?: string,
    permissions?: never,
    cooldown?: number
    do: (message: Discord.Message, client?: Discord.Client, args?: string[], Discord?: typeof import ('discord.js')) => unknown | Promise<unknown>
}

export interface CooldownOptions {
has: Discord.Collection<unknown, unknown>
get: Discord.Collection<unknown, unknown>
set: Discord.Collection<unknown, unknown>
delete: Discord.Collection<unknown, unknown>
}

declare module 'discord.js' {
  export interface Client {
    events: Discord.Collection<string, Event>
    commands: Discord.Collection<string, Command>
    cooldowns: Discord.Collection<string, CooldownOptions>
  }
}