import { CommandInteraction, MessageEmbed } from 'discord.js';

export default {
    name: 'say',
    description: 'Sends a message through the bot',
    options: [
        {
            name: 'message',
            description: 'What to send',
            type: 'STRING',
            required: true,
        },
        {
            name: 'channel',
            description: 'The channel to send a message in',
            type: 'CHANNEL',
        },
        {
            name: 'embed',
            description: 'Whether or not to send the message in an embed',
            type: 'BOOLEAN',
        },
    ],
    defaultPermission: false,
    run: async (interaction: CommandInteraction) => {
        if (interaction.options.getBoolean('embed')) {
            const embed = new MessageEmbed()
                .setColor(0x6293f5)
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ format: 'png', dynamic: true }))
                .setDescription(interaction.options.getString('message'))
                .setTimestamp();
            await send('', [embed], interaction);
        } else {
            await send(interaction.options.getString('message'), [], interaction);
        }
    },
};

/**
 * A function for sending say messages and handling errors as well as information regarding the message being sent.
 * @param input - String to send
 * @param embeds - Array of MessageEmbeds to send
 * @param interaction - discord.js CommandInteraction
 * @example
 * // This should work if you haven't modified any variable shown here.
 * const str: string = 'Hello, world!';
 * await send(str, sayChannel, message.channel);
 */
async function send(input: string, embeds: MessageEmbed[], interaction: CommandInteraction): Promise<void> {
    const channel = interaction.options?.getChannel('channel') ?? interaction.channel;
    try {
        //@ts-expect-error discord.js typings
        await channel?.send({ content: `${input}`, embeds: embeds });
    } catch (error) {
        console.error(`Could not send message to #${channel?.name ?? 'unknown-name'} (${channel.id}):\n`, error);
        return interaction.reply({ content: `❌ Could not send message to ${channel.toString()}.`, ephemeral: true });
    }
    interaction.reply({ content: `✅ Successfully sent message to ${channel.toString()}!`, ephemeral: true });
}
