import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    InteractionResponse,
    MessageFlags,
    SlashCommandBuilder,
    User,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Sends a direct message through the bot')
        .addUserOption((option) => option.setName('user').setDescription('User you want to DM').setRequired(true))
        .addStringOption((option) => option.setName('message').setDescription('What to send').setRequired(true))
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

        const dmUser = interaction.options.getUser('user', true);
        if (dmUser.bot) {
            return interaction.reply({
                content: '❌ You cannot send messages to bots.',
                flags: MessageFlags.Ephemeral,
            });
        }

        if (interaction.options.getBoolean('embed')) {
            const embed = new EmbedBuilder()
                .setColor(0x6293f5)
                .setDescription(interaction.options.getString('message'))
                .setTimestamp();
            return send('\u200B', [embed], dmUser, interaction);
        }
        await send(interaction.options.getString('message', true), [], dmUser, interaction);
    },
};

async function send(
    input: string,
    embeds: EmbedBuilder[],
    user: User,
    interaction: ChatInputCommandInteraction,
): Promise<InteractionResponse> {
    try {
        user.send({ content: input, embeds: embeds });
        await interaction.reply({
            content: `✅ Successfully sent DM to **${user.tag}**!`,
            flags: MessageFlags.Ephemeral,
        });
    } catch (error) {
        console.error(
            `Could not send ${interaction.user.tag}'s (${interaction.user.id}) DM to ${user.tag} (${user.id}):\n`,
            error,
        );
        return interaction.reply({
            content: `❌ Could not send message to **${user.tag}**.`,
            flags: MessageFlags.Ephemeral,
        });
    }
}
