import { CommandInteraction, Permissions } from 'discord.js';

export default {
    name: 'unban',
    description: 'Unbans a previously banned user from your server.',
    options: [
        {
            name: 'user',
            description: 'User to unban',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason for unbanning the user',
            type: 'STRING',
        },
    ],
    defaultPermission: true,
    run: async (interaction: CommandInteraction) => {
        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Ban Members` permission in order to execute this command.',
                ephemeral: true,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({ content: '❌ Unknown permissions. Please try again later.', ephemeral: true });
        else if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({
                content: '⛔ You need the `Ban Members` permission in order to use this command!',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('user');

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'How do you unban yourself? 🤔', ephemeral: true });
        }
        try {
            await interaction.guild.members.unban(
                user,
                interaction.options?.getString('reason') ? `${interaction.options?.getString('reason')}` : '',
            );
            interaction.reply({ content: `✅ Unbanned \`${user.tag} (${user.id})\`.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: `❌ I encountered an error while trying to unban \`${user.tag}\`: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                ephemeral: true,
            });
        }
    },
};
