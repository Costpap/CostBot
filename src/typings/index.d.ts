import { Message, Client, Collection } from "discord.js";

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
  do: (message: Message, client?: Client, args?: string[], Discord?: typeof import ("discord.js")) => unknown | Promise<unknown>
}

export interface CooldownOptions {
/* eslint-disable @typescript-eslint/no-explicit-any */
has: any
get: any
set: any
delete: any
/* eslint-enable @typescript-eslint/no-explicit-any */
}

declare module 'discord.js' {
  export interface Client {
    events: Collection<string, unknown>
    commands: Collection<string, Command>
    cooldowns: Collection<string, CooldownOptions>
  }
}