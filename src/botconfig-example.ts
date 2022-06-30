import { LogChannel } from './typings';

/**
 * An array of IDs of bot "owners". Used for validation in ownerOnly commands
 * and for the `info` command (by default).
 * @constant
 */
export const botOwner = ['Your ID'] as string[];

/**
 * An array of IDs of bot "admins". Can be anything such as bot staff.
 * Used for validation in adminOnly commands.
 * @constant
 */
export const botAdmin = ['A list of IDs of trusted people'] as string[];

/**
 * The link to the Bot's GitHub repository. Shown in `info` command (by default).
 * You may change it to your own repository or leave it as it is.
 * @constant
 */
export const repository = 'https://github.com/Costpap/CostBot' as string;

/**
 * Information such as channel IDs and webhook tokens for logging channels.
 *
 * @property {object} corelog - Information about the corelog.
 * @property {string} corelog.id - The channel ID for the core log. Should be a snowflake.
 * @property {string} corelog.webhookId - An ID for a webhook. Should be a snowflake.
 * Can be any ID that is on the same channel as the token provided.
 * @property {string} corelog.token - A token for a webhook.
 * Can be any webhook that is on the same channel as the webhook ID provided.
 *
 * @property {object} errorlog - Information about the errorlog.
 * @property {string} errorlog.id - A channel ID for the error log. Should be a snowflake.
 * @property {string} errorlog.webhookId - An ID for a webhook. Should be a snowflake.
 * Can be any ID that is on the same channel as the token provided.
 * @property {string} errorlog.token - A token for a webhook.
 * Can be any webhook that is on the same channel as the webhook ID provided.
 */
const loggingInfo = {
    /**
     * Information about the corelog.
     * @property {string} id - The channel ID for the core log. Should be a snowflake.
     * @property {string} webhookId - An ID for a webhook. Should be a snowflake.
     * Can be any ID that is on the same channel as the token provided.
     * @property {string} token - A token for a webhook.
     * Can be any webhook that is on the same channel as the webhook ID provided.
     */
    corelog: {
        id: "Channel ID of bot's core log",
        webhookId: "Webhook ID of bot's core log",
        token: "Webhook Token of bot's core log",
    } as LogChannel,

    /**
     * Information about the errorlog.
     * @property {string} id - A channel ID for the error log. Should be a snowflake.
     * @property {string} webhookId - An ID for a webhook. Should be a snowflake.
     * Can be any ID that is on the same channel as the token provided.
     * @property {string} token - A token for a webhook.
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
