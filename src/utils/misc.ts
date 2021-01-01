import { promisify } from 'util';
import child_process from 'child_process';
import humanizeDuration from 'humanize-duration';
import fetch from 'node-fetch';
import { MessageEmbed, Client } from 'discord.js';

/**
 * Executes code in shell.
 * @requires module:child_process/exec
 * @requires module:util/promisify
 * @example
 * import { exec } from './utils/misc';
 *
 * exec('echo Hello, world!');
 * @see {@link https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback Node.js Documentation}
 * for more information on how to use child_process.exec
 */
export const exec = promisify(child_process.exec);

/**
 * A simple text cleaner.
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 * @example
 * import { clean } from './utils/misc';
 *
 * const code: string = args.join(', ');
 * const evaled = await eval(code);
 *
 * console.log(clean(evaled));
 */
export const clean = (text: string): string => {
    if (typeof text === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
        return text;
    }
};

/**
 * Parses a Markdown codeblock and returns the text inside of it.
 * @param {string} script - The code to parse
 * @returns {string} Code without codeblock
 */
export const parseCodeblock = (script: string): string => {
    const cbr = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm;
    const result: RegExpExecArray = cbr.exec(script);
    if (result) {
        return result[4];
    }
    return script;
};

/**
 * Automatically gets the latest release from {@link https://github.com/Costpap/CostBot GitHub}.
 * @param {string} tag_name - The name of the tag of the latest release, for example: `v0.0.0`
 * @returns {Promise<string>} The name of the tag of the latest release, for example: `v0.0.0`
 * @example
 * import { version } from './utils/misc';
 *
 * console.log(version());
 */
export const version = async (): Promise<string> => {
    const { tag_name } = await fetch('https://api.github.com/repos/Costpap/CostBot/releases/latest').then((response) =>
        response.json(),
    );
    return tag_name as string;
};

/**
 *
 * @param embed - discord.js messageEmbed
 * @param client - discord.js client
 * @param strings - Strings required for field names
 * @param values - Values required for embeds
 * @param options - Options
 * @param {boolean} options.noInline - Whether or not to inline the embed fields
 * @param {boolean} options.noUptimeInline - Whether or not to inline the uptime field
 * @param {boolean} options.noUptime - Whether or not to add an uptime field
 * @example
 * import  Discord from 'discord.js';
 * import { clientStats } from './src/utils/misc';
 *
 * const embed = new Discord.MessageEmbed();
 * clientStats(embed, client);
 *
 * message.channel.send(embed);
 */
export async function clientStats(
    embed: MessageEmbed,
    client: Client,
    options?: ClientStatOptions,
): Promise<MessageEmbed> {
    /**
     * Strings used in embed field names.
     * @param {string} serverCount - Server Count
     * @param {string} members - Total Members
     * @param {string} uptime - Bot Uptime
     */
    const strings = {
        serverCount: 'Server Count',
        members: 'Total Members',
        membersExcludingBots: 'Total Members (excluding bots)',
        uptime: 'Bot Uptime',
    };
    /**
     * Values used in embed field values.
     * @param {number} serverCount - client.guilds.cache.size
     * @param {number} members - client.users.cache.size
     * @param {string} uptime - client.uptime in humanized form.
     * @param {string} membersExcludingBots - client.users.cache excluding bots.
     * @param {string} membersExcludingBots2 - client.users.cache both with and without bots/
     */
    const values = {
        serverCount: client.guilds.cache.size,
        members: client.users.cache.size,
        membersExcludingBots: client.users.cache.filter((u) => !u.bot).size,
        membersExcludingBots2: `${client.users.cache.size} (${
            client.users.cache.filter((u) => !u.bot).size
        } excluding bots)`,
        uptime: humanizeDuration(client.uptime),
    };

    if (options?.noInline) {
        return embed.addFields(
            { name: strings.serverCount, value: values.serverCount, inline: false },
            { name: strings.members, value: values.members, inline: false },
            { name: strings.uptime, value: values.uptime, inline: false },
        );
    }
    if (options?.noUptimeInline) {
        return embed.addFields(
            { name: strings.serverCount, value: values.serverCount, inline: true },
            { name: strings.members, value: values.members, inline: true },
            { name: strings.uptime, value: values.uptime, inline: false },
        );
    }
    if (options?.noUptime) {
        return embed.addFields(
            { name: strings.serverCount, value: values.serverCount, inline: true },
            { name: strings.members, value: values.members, inline: true },
        );
    }
    if (options?.membersExcludingBots) {
        return embed.addFields(
            { name: strings.serverCount, value: values.serverCount, inline: true },
            { name: strings.members, value: values.members, inline: true },
            { name: strings.membersExcludingBots, value: values.membersExcludingBots, inline: false },
            { name: strings.uptime, value: values.uptime, inline: true },
        );
    }
    if (options?.membersExcludingBots2) {
        return embed.addFields(
            { name: strings.serverCount, value: values.serverCount, inline: true },
            { name: strings.members, value: values.membersExcludingBots2, inline: true },
            { name: strings.uptime, value: values.uptime, inline: false },
        );
    }
    return embed.addFields(
        { name: strings.serverCount, value: values.serverCount, inline: true },
        { name: strings.members, value: values.members, inline: true },
        { name: strings.uptime, value: values.uptime, inline: true },
    );
}

export interface ClientStatOptions {
    /** Whether or not to inline the embed fields */
    noInline?: boolean;
    /** Whether or not to inline the uptime field */
    noUptimeInline?: boolean;
    /** Whether or not to add an uptime field */
    noUptime?: boolean;
    /**
     * Whether or not to add a field displaying the total amount of users accessible by CostBot,
     * excluding bots.
     */
    membersExcludingBots?: boolean;
    /** A more compact way to display both total members and total members excluding bots. */
    membersExcludingBots2?: boolean;
}
