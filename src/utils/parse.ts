import { Client, User, Guild, GuildMember, TextChannel, NewsChannel, Role } from 'discord.js';

/**
 * The Regular Expression against which to match User and GuildMember mentions.
 * @constant
 */
const userRegEx = /^<@!?(\d+)>$/;

/**
 * Parses an argument as a User mention.
 * @param {string} mention - The mention to parse
 * @param client - discord.js Client
 * @returns discord.js User
 * @example
 * import { parseUserMention } from './src/utils/parse';
 *
 * const user = parseUserMention(args[0], client);
 * console.log(user);
 */
export function parseUserMention(mention: string, client: Client): User {
    const matches: RegExpMatchArray = mention.match(userRegEx);
    if (!matches) return;
    const id: string = matches[1];
    return client.users.cache.get(id);
}

/**
 * Parses an argument as a GuildMember mention.
 * @param {string} mention - The mention to parse
 * @param message - discord.js Message
 * @param guild - discord.js Guild
 * @returns discord.js GuildMember
 * @example
 * import { parseMemberMention } from './src/utils/parse';
 * import { GuildMember } from 'discord.js';
 *
 * const member: GuildMember = parseMemberMention(args[0], message.guild);
 * console.log(member);
 */
export function parseMemberMention(mention: string, guild: Guild): GuildMember {
    const matches: RegExpMatchArray = mention.match(userRegEx);
    if (!matches) return;
    const id: string = matches[1];
    return guild.members.cache.get(id);
}

/**
 * The Regular Expression against which to match Channel mentions.
 * @constant
 */
const channelRegEx = /^<#(\d+)>$/;

/**
 * Parses an argument as a Channel mention.
 * @param mention - The mention to parse
 * @param client - discord.js Client
 * @returns discord.js GuildChannel | TextChannel | NewsChannel
 * @example
 * import { parseChannelMention } from './src/utils/parse';
 * import { TextChannel, NewsChannel } from 'discord.js';
 *
 * const channel: TextChannel | NewsChannel = parseChannelMention(args[0], message.guild);
 * console.log(channel);
 */
export function parseChannelMention(mention: string, client: Client): TextChannel | NewsChannel {
    const matches: RegExpMatchArray = mention.match(channelRegEx);
    if (!matches) return;
    const id: string = matches[1];
    return client.channels.cache.get(id) as TextChannel | NewsChannel;
}

/**
 * The Regular Expression against which to match Role mentions.
 * @constant
 */
const roleRegEx = /^<@&(\d+)>&/;

/**
 * Parses an argument as a Role mention.
 * @param mention - The mention to parse
 * @param guild - discord.js Guild
 * @returns discord.js Role
 */
export function parseRoleMention(mention: string, guild: Guild): Role {
    const matches: RegExpMatchArray = mention.match(roleRegEx);
    if (!matches) return;
    const id: string = matches[1];
    return guild.roles.cache.get(id);
}
