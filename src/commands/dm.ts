import { CommandInteraction, MessageEmbed, User } from 'discord.js';

export default {
    name: 'dm',
    description: 'Sends a direct message through the bot',
    options: [
        {
            name: 'user',
            description: 'User you want to DM',
            type: 'USER',
            required: true,
        },
        {
            name: 'message',
            description: 'What to send',
            type: 'STRING',
            required: true,
        },
        {
            name: 'embed',
            description: 'Whether or not to send the message in an embed',
            type: 'BOOLEAN',
        },
    ],
    defaultPermission: false,
    run: async (interaction: CommandInteraction) => {
        const dmUser = interaction.options.getUser('user');
        if (dmUser.bot) {
            return interaction.reply({ content: '❌ You cannot send messages to bots.', ephemeral: true });
        }

        if (interaction.options.getBoolean('embed')) {
            const embed = new MessageEmbed()
                .setColor(0x6293f5)
                .setDescription(interaction.options.getString('message'))
                .setTimestamp();
            return send('\u200B', [embed], dmUser, interaction);
        }
        await send(interaction.options.getString('message'), [], dmUser, interaction);
    },
};

async function send(input: string, embeds: MessageEmbed[], user: User, interaction: CommandInteraction): Promise<void> {
    try {
        user.send({ content: input, embeds: embeds });
        await interaction.reply({ content: `✅ Successfully sent DM to **${user.tag}**!`, ephemeral: true });
    } catch (error) {
        console.error(
            `Could not send ${interaction.user.tag}'s (${interaction.user.id}) DM to ${user.tag} (${user.id}):\n`,
            error,
        );
        return interaction.reply({
            content: `❌ Could not send message to **${user.tag}**.`,
            ephemeral: true,
        });
    }
}
