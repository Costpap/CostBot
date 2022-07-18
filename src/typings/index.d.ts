import { Client, Collection, PermissionResolvable } from 'discord.js';

export interface Command {
    /** The name of the command, should be identical to the file name. */
    name: string;
    /** The description of the command. Shown in `help` command (by default). */
    description?: string;
    /**
     * The aliases of the command. Function exactly the same as the command's `name`,
     * except for some small differences in the `help` command
     * and the fact that the `name` always takes priority over aliases.
     */
    aliases?: string[];
    /**
     * Whether or not the command is disabled. Will prevent people from using the command if `true`,
     * unless executing it with the `eval` command.
     */
    disabled?: boolean;
    /** Whether or not the command uses arguments. */
    args?: boolean;
    /** Whether or not the command can be used in DMs. Will disallow people from using it there if set to `true`. */
    guildOnly?: boolean;
    /**
     * Whether or not the command can only be used by the people defined as Admins in the botconfig.
     * Will also work with people defined as Owners.
     */
    adminOnly?: boolean;
    /**
     * Whether or not the command can only be used by the people defined as Owners in the botconfig.
     * Will not work with people defined as Admins.
     */
    ownerOnly?: boolean;
    /** An example on how to use the command. Shown in `help` command (by default). */
    usage?: string;
    /** The Discord permissions needed by the bot in order to execute the command. */
    permissions?: PermissionResolvable[];
    /**
     * This is where the code to be executed goes.
     * @param message - discord.js Message
     * @param client - discord.js Client
     * @param {string[]} args - The `message.content` split into an array.
     * @param Discord - An import of discord.js. Can be used to access properties and constructors such as
     * `EmbedBuilder`, `Collection`, `Util`.
     */
    do: (
        /** discord.js Command Interaction */
        interaction: ChatInputCommandInteraction,
        /** discord.js Client */
        client?: Client,
        /** `message.content` split into an array. */
        args?: string[],
        /**
         * An import of discord.js. Can be used to access properties and constructors such as
         * `EmbedBuilder`, `Collection`, `Util`.
         */
        Discord?: typeof import('discord.js'),
    ) => unknown | Promise<unknown>;
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
