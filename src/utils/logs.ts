import type { LogChannel } from '../typings';
import { Message, MessageEmbed, Client, TextChannel, NewsChannel } from 'discord.js';
import { corelog, errorlog } from '../botconfig';

/**
 * Arrow function used for sending messages to the logging channels.
 * @param client - discord.js Client
 * @param config - Log channel
 * @param input - What to send
 * @param options - Options
 */
const send = async (
    client: Client,
    config: LogChannel,
    input: string,
    embeds: MessageEmbed[],
    options?: LogOptions,
): Promise<Message> => {
    if (!config || !config.id) return;
    if (options?.noWebhook) {
        return (
            (client.channels.cache.get(config.id) as TextChannel | NewsChannel).send(input) ||
            (await (client.channels.fetch(config.id) as Promise<TextChannel | NewsChannel>)).send(input)
        );
    }

    /* This if statement is separate from the return at the start of the function 
    in order to allow for messages to be sent without requiring a webhook ID/token
    when "noWebhook" is set to "true", if you so choose to. */
    if (!config.webhookId || !config.token) return;
    try {
        const webhook = await client.fetchWebhook(config.webhookId, config.token);
        if (options?.noContent) {
            webhook.send({
                embeds: embeds,
                avatarURL: client.user.displayAvatarURL({ format: 'png' }),
                username: webhook.name ?? client.user.username,
            });
        } else {
            webhook.send({
                content: input,
                embeds: embeds,
                avatarURL: client.user.displayAvatarURL({ format: 'png' }),
                username: webhook.name ?? client.user.username,
            });
        }
    } catch (error) {
        console.error('Error sending message with webhook:\n', error);
    }
};

/**
 * Sends a message to the `coreLog` channel.
 * @param {string} input - What to send
 * @param client - discord.js Client
 * @param options - Options
 */
export const coreLog = async (
    input: string,
    embeds: MessageEmbed[],
    client: Client,
    options?: LogOptions,
): Promise<Message> => {
    return send(client, corelog, input, embeds, options);
};

/**
 * Sends a message to the `errorLog` channel.
 * @param input - What to send
 * @param client - discord.js Client
 * @param options - Options
 */
export const errorLog = async (
    input: string,
    embeds: MessageEmbed[],
    client: Client,
    options?: LogOptions,
): Promise<Message> => {
    return send(client, errorlog, input, embeds, options);
};

export interface LogOptions {
    /** Whether to send the message as a webhook or not */
    noWebhook?: boolean;
    /** Whether to include content when sending only embeds. */
    noContent?: boolean;
}
