import { CommandInteraction, MessageEmbed } from 'discord.js';

export default {
    name: 'avatar',
    description: 'Gets the avatar of the mentioned user or yourself.',
    options: [
        {
            name: 'user',
            description: 'User whose avatar you want to get',
            type: 'USER',
        },
    ],
    defaultPermission: true,
    run: async (interaction: CommandInteraction) => {
        const user = interaction.options?.getUser('user') ?? interaction.user;

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(user.tag, user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setDescription(
                `[Click here for URL](${user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })})`,
            )
            .setImage(user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setTimestamp()
            .setFooter(
                `Requested by ${interaction.user.tag}`,
                interaction.user.displayAvatarURL({ format: 'png', dynamic: true }),
            );

        await interaction.reply({ embeds: [embed] });
    },
};
