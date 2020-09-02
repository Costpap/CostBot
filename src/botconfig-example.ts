/**
 * A prefix used before commands. Should be short, easy to remember, and mainly consist of symbols,
 * such as `!`, `?`, `>`, `=`, `-`, `%`, `^`, `&`, `*`, `$`, `.`, `,` and `/`.
 * @param {string} prefix The bot's prefix. Up to 5 characters.
 */
export const prefix = "Your bot's prefix here" as string;

/**
 * An array of IDs of bot "owners". Used for validation in ownerOnly commands
 * and for the `info` command (by default).
 * @param {string[]} botOwner An array of snowflakes.
 */
export const botOwner = ['Your ID'] as string[];

/**
 * An array of IDs of bot "admins". Can be anything such as bot staff.
 * Used for validation in adminOnly commands.
 * @param {string[]} botAdmin An array of snowflakes.
 */
export const botAdmin = ['A list of IDs of trusted people'] as string[];

/**
 * The link to the Bot's GitHub repository. Shown in `info` command (by default).
 * You may change it to your own repository or leave it as it is.
 * @param {string} repository A URL leading to a repository.
 */
export const repository = 'https://github.com/Costpap/CostBot' as string;

/**
 * Information such as channel IDs and webhook tokens for logging channels.
 * @param {Object} corelog Information about the corelog.
 * @param {string} corelog.id The channel ID for the corelog. Should be a snowflake.
 * @param {string} corelog.token A token for a webhook. Can be any webhook that is on the same channel as the ID provided.
 * @param {Object} guidlog Information about the guidlog.
 * @param {string} guildlog.id The channel ID for the guildlog. Should be a snowflake.
 * @param {string} guildlog.token A token for a webhook. Can be any webhook that is on the same channel as the ID provided.
 * @param {Object} errorlog Information about the errorlog.
 * @param {string} errorlog.id A channel ID for the errorlog. Should be a snowflake.
 * @param {string} errorlog.token A token for a webhook. Can be any webhook that is on the same channel as the ID provided.
 */
const loggingInfo = {
    corelog: {
        id: "Channel ID of Bot's Corelog",
        token: "Webhook Token of Bot's Corelog",
    },
    guildlog: {
        id: "Channel ID of Bot's GuildLog",
        token: "Webhook Token of Bot's GuildLog",
    },
    errorlog: {
        id: "Channel ID of Bot's Errorlog",
        token: "Webhook Token of Bot's GuildLog",
    },
};
// Destructing, allows for easier access to properties.
export const {
    corelog: { id: corelogID, token: corelogToken },
    guildlog: { id: guildlogID, token: guildlogToken },
    errorlog: { id: errorlogID, token: errorlogToken },
} = loggingInfo;
