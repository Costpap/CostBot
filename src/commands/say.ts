import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildTextBasedChannel,
    InteractionResponse,
    MessageFlags,
    SlashCommandBuilder,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Sends a message through the bot')
        .addStringOption((option) => option.setName('message').setDescription('What to send').setRequired(true))
        .addChannelOption((option) =>
            option.setName('channel').setDescription('Channel to send message to').setRequired(false),
        )
        .addBooleanOption((option) =>
            option.setName('embed').setDescription('Whether or not to send the message in an embed').setRequired(false),
        )
        .setDefaultMemberPermissions(0),
    internals: {
        privileged: true,
    },
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (interaction.options.getBoolean('embed')) {
            const embed = new EmbedBuilder()
                .setColor(0x6293f5)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ extension: 'png', forceStatic: false }),
                })
                .setDescription(interaction.options.getString('message', true))
                .setTimestamp();
            await sendEmbed([embed], interaction);
        } else {
            await send(interaction.options.getString('message', true), interaction);
        }
    },
};

/**
 * A function for sending say messages and handling errors as well as information regarding the message being sent.
 * @param input - String to send
 * @param interaction - discord.js CommandInteraction
 * @example
 * // This should work if you haven't modified any variable shown here.
 * const str: string = 'Hello, world!';
 * await send(str, interaction);
 */
async function send(input: string, interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
    // Typeguard in order to ensure having access to ChatInputCommand interaction options.
    if (!interaction.isChatInputCommand()) return;

    const channel = (interaction.options?.getChannel('channel') ?? interaction.channel) as GuildTextBasedChannel;

    try {
        await channel?.send({ content: `${input}` });
    } catch (error) {
        console.error(`Could not send message to #${channel?.name ?? 'unknown-name'} (${channel.id}):\n`, error);
        return interaction.reply({
            content: `❌ Could not send message to ${channel.toString()}.`,
            flags: MessageFlags.Ephemeral,
        });
    }
    interaction.reply({
        content: `✅ Successfully sent message to ${channel.toString()}!`,
        flags: MessageFlags.Ephemeral,
    });
}

/**
 * A function for sending embed messages and handling errors as well as information regarding the message being sent.
 * @param embeds - Array of EmbedBuilders to send
 * @param interaction - discord.js CommandInteraction
 * @example
 * // This should work if you haven't modified any variable shown here.
 * const str: string = 'Hello, world!';
 * await send([embed1, embed2, etc], message.interaction);
 */
async function sendEmbed(
    embeds: EmbedBuilder[],
    interaction: ChatInputCommandInteraction,
): Promise<InteractionResponse> {
    // Typeguard in order to ensure having access to ChatInputCommand interaction options.
    if (!interaction.isChatInputCommand()) return;

    const channel = (interaction.options?.getChannel('channel') ?? interaction.channel) as GuildTextBasedChannel;

    try {
        await channel?.send({ embeds: embeds });
    } catch (error) {
        console.error(`Could not send message to #${channel?.name ?? 'unknown-name'} (${channel.id}):\n`, error);
        return interaction.reply({
            content: `❌ Could not send message to ${channel.toString()}.`,
            flags: MessageFlags.Ephemeral,
        });
    }
    interaction.reply({
        content: `✅ Successfully sent message to ${channel.toString()}!`,
        flags: MessageFlags.Ephemeral,
    });
}
