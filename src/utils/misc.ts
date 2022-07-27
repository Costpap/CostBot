import child_process from 'child_process';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import {
    ChatInputCommandInteraction,
    Client,
    DiscordAPIError,
    EmbedBuilder,
    Interaction,
    RESTJSONErrorCodes,
    User,
    version as libraryVersion,
} from 'discord.js';
import humanizeDuration from 'humanize-duration';
import { version as tsVersion } from 'typescript';
import { promisify } from 'util';
import { version } from './version';

dayjs.extend(utc);
dayjs.extend(relativeTime);

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
 *
 * @param embed - discord.js EmbedBuilder
 * @param client - discord.js client
 * @param options - Options
 * @param {boolean} options.noInline - Whether or not to inline the embed fields
 * @param {boolean} options.noUptimeInline - Whether or not to inline the uptime field
 * @param {boolean} options.noUptime - Whether or not to add an uptime field
 * @property {object} strings - Strings required for field names
 * @property {object} values - Values required for embeds
 * @example
 * import  Discord from 'discord.js';
 * import { clientStats } from './src/utils/misc';
 *
 * const embed = new Discord.EmbedBuilder();
 * clientStats(embed, client);
 *
 * message.channel.send(embed);
 */
export async function clientStats(
    embed: EmbedBuilder,
    client: Client,
    options?: ClientStatOptions,
): Promise<EmbedBuilder> {
    /**
     * Strings used in embed field names.
     * @property {string} serverCount - Server Count
     * @property {string} members - Total Members
     * @property {string} uptime - Bot Uptime
     */
    const strings = {
        serverCount: 'Server Count',
        members: 'Total Members',
        membersExcludingBots: 'Total Members (excluding bots)',
        uptime: 'Bot Uptime',
    };
    /**
     * Values used in embed field values.
     * @property {number} serverCount - client.guilds.cache.size
     * @property {number} members - client.users.cache.size
     * @property {string} uptime - client.uptime in humanized form.
     * @property {string} membersExcludingBots - client.users.cache excluding bots.
     * @property {string} membersExcludingBots2 - client.users.cache both with and without bots/
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
            { name: `${strings.serverCount}`, value: `${values.serverCount}`, inline: false },
            { name: `${strings.members}`, value: `${values.members}`, inline: false },
            { name: `${strings.uptime}`, value: `${values.uptime}`, inline: false },
        );
    }
    if (options?.noUptimeInline) {
        return embed.addFields(
            { name: `${strings.serverCount}`, value: `${values.serverCount}`, inline: true },
            { name: `${strings.members}`, value: `${values.members}`, inline: true },
            { name: `${strings.uptime}`, value: `${values.uptime}`, inline: false },
        );
    }
    if (options?.noUptime) {
        return embed.addFields(
            { name: `${strings.serverCount}`, value: `${values.serverCount}`, inline: true },
            { name: `${strings.members}`, value: `${values.members}`, inline: true },
        );
    }
    if (options?.membersExcludingBots) {
        return embed.addFields(
            { name: `${strings.serverCount}`, value: `${values.serverCount}`, inline: true },
            { name: `${strings.members}`, value: `${values.members}`, inline: true },
            { name: `${strings.membersExcludingBots}`, value: `${values.membersExcludingBots}`, inline: false },
            { name: `${strings.uptime}`, value: `${values.uptime}`, inline: true },
        );
    }
    if (options?.membersExcludingBots2) {
        return embed.addFields(
            { name: `${strings.serverCount}`, value: `${values.serverCount}`, inline: true },
            { name: `${strings.members}`, value: `${values.membersExcludingBots2}`, inline: true },
            { name: `${strings.uptime}`, value: `${values.uptime}`, inline: false },
        );
    }
    return embed.addFields(
        { name: `${strings.serverCount}`, value: `${values.serverCount}`, inline: true },
        { name: `${strings.members}`, value: `${values.members}`, inline: true },
        { name: `${strings.uptime}`, value: `${values.uptime}`, inline: true },
    );
}

/**
 * Generates an embed that is mostly useful for logging purposes in an error log channel.
 * @param {string} title - The title of the embed
 * @param {string} error - The error message
 * @param interaction - discord.js Interaction
 * @example
 * import { generateBasicErrorEmbed } from './src/utils/misc';
 *
 * const embed = await generateBasicErrorEmbed('ReferenceError', 'ReferenceError: message is not defined', message);
 * message.channel.send(embed);
 */
export async function generateBasicErrorEmbed(
    title: string,
    error: string,
    interaction: Interaction,
): Promise<EmbedBuilder> {
    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(title)
        .setDescription(`\`\`\`js\n${clean(error)}\`\`\``)
        .addFields(
            { name: 'Debug information:', value: '\u200B' },
            { name: 'Bot Version', value: await version(), inline: true },
            { name: 'TypeScript Version', value: `v${tsVersion}`, inline: true },
            { name: 'discord.js Version', value: `v${libraryVersion}`, inline: true },
            {
                name: 'Guild and Channel name',
                value: `\`${interaction.guild.name}\` ${interaction.channel.toString()}`,
                inline: true,
            },
            { name: 'Interaction ID', value: interaction.id, inline: true },
            { name: 'Initiated by', value: `\`${interaction.user.tag} (${interaction.user.id})\``, inline: true },
        )
        .setTimestamp();

    return embed;
}

/**
 * Parses and formats a date object appropriately.
 * @param {Date} date - The date object to parse/format
 * @returns {string} `ddd, D MMM YYYY HH:mm:ss UTC (Roughly [time] ago)`
 * @example
 * import { parseDate } from './src/utils/parse';
 *
 * const d = parseDate(new Date());
 * console.log(d);
 */
export function parseDate(date: Date): string {
    const actualDate: string = dayjs(date).utc().format('ddd[,] D MMM YYYY HH:mm:ss');
    const agoTime: string = dayjs().to(dayjs(actualDate));
    const completeDate = `${actualDate} UTC (Roughly ${agoTime})`;
    return completeDate;
}

/**
 * DMs a user, usually when a moderation action is taken on them, in order to let them know of such action.
 * @param {User} user - The user to DM
 * @param {ChatInputCommandInteraction} interaction - The slash command interaction
 * @param {string} actioned - Included in the message that gets sent to the user.
 * Should let them know what action was taken.
 * @returns {boolean} Whether or the bot was able to DM the user.
 */
export async function notifyUser(
    user: User,
    interaction: ChatInputCommandInteraction,
    actioned: string,
): Promise<boolean> {
    try {
        await user.send(
            `Hi there **${user.username}**! You have been ${actioned} from **${interaction.guild.name}** ${
                interaction.options?.getString('reason')
                    ? `for the following reason: \n\n**${interaction.options?.getString('reason')}**`
                    : '.'
            }`,
        );
        return true;
    } catch (error) {
        if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) {
            return false;
        }
    }
}

export interface ClientStatOptions {
    /** Whether or not to inline the embed fields */
    noInline?: boolean;
    /** Whether or not to inline the uptime field */
    noUptimeInline?: boolean;
    /** Whether or not to add an uptime field */
    noUptime?: boolean;
    /**
     * Whether or not to add a field displaying the total amount of users cached by the bot,
     * excluding bots.
     */
    membersExcludingBots?: boolean;
    /** A more compact way to display both total members and total members excluding bots. */
    membersExcludingBots2?: boolean;
}
