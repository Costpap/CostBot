import { LogChannel } from './typings';

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
 *
 * @param {Object} corelog - Information about the corelog.
 * @param {string} corelog.id - The channel ID for the core log. Should be a snowflake.
 * @param {String} corelog.webhookId - An ID for a webhook. Should be a snowflake.
 * Can be any ID that is on the same channel as the token provided.
 * @param {string} corelog.token - A token for a webhook.
 * Can be any webhook that is on the same channel as the webhook ID provided.
 *
 * @param {Object} errorlog - Information about the errorlog.
 * @param {string} errorlog.id - A channel ID for the error log. Should be a snowflake.
 * @param {string} errorlog.webhookId - An ID for a webhook. Should be a snowflake.
 * Can be any ID that is on the same channel as the token provided.
 * @param {string} errorlog.token - A token for a webhook.
 * Can be any webhook that is on the same channel as the webhook ID provided.
 */
const loggingInfo = {
    /**
     * Information about the corelog.
     * @param {string} id - The channel ID for the core log. Should be a snowflake.
     * @param {string} webhookId - An ID for a webhook. Should be a snowflake.
     * Can be any ID that is on the same channel as the token provided.
     * @param {string} token - A token for a webhook.
     * Can be any webhook that is on the same channel as the webhook ID provided.
     */
    corelog: {
        id: "Channel ID of bot's core log",
        webhookId: "Webhook ID of bot's core log",
        token: "Webhook Token of bot's core log",
    } as LogChannel,

    /**
     * Information about the errorlog.
     * @param {string} id - A channel ID for the error log. Should be a snowflake.
     * @param {string} webhookId - An ID for a webhook. Should be a snowflake.
     * Can be any ID that is on the same channel as the token provided.
     * @param {string} token - A token for a webhook.
     * Can be any webhook that is on the same channel as the webhook ID provided.
     */
    errorlog: {
        id: "Channel ID of bot's error log",
        webhookId: "Webhook ID of bot's error log",
        token: "Webhook Token of bot's error log",
    } as LogChannel,
};
// Destructing, allows for easier access to properties.
export const { corelog, errorlog } = loggingInfo;
