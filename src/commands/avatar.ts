import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Gets the avatar of the mentioned user or yourself.')
        .addUserOption((option) =>
            option.setName('user').setDescription('User whose avatar you want to get').setRequired(false),
        ),
    run: async (interaction: ChatInputCommandInteraction) => {
        const user = interaction.options?.getUser('user') ?? interaction.user;

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ extension: 'png', forceStatic: false }) })
            .setDescription(
                `[Click here for URL](${user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 4096 })})`,
            )
            .setImage(user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 }))
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ extension: 'png', forceStatic: false }),
            });

        await interaction.reply({ embeds: [embed] });
    },
};
