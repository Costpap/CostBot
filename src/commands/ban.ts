import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export default {
    name: 'ban',
    description: 'Bans the mentioned user from your server.',
    options: [
        {
            name: 'user',
            description: 'User to ban',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason for banning the user',
            type: 'STRING',
        },
    ],
    defaultPermission: true,
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Ban Members` permission n order to execute this command.',
                ephemeral: true,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({ content: '❌ Unknown permissions. Please try again later.', ephemeral: true });
        else if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '⛔ You need the `Ban Members` permission in order to use this command!',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('user', true);

        /* This checks if the user to be banned is the person who sent the command,
        and if true, it prevents them from banning themselves. */
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: "Aww, please don't ban yourself! 💖", ephemeral: true });
        }

        /* Attempts to ban the user. If the ban is successful,
        the bot will send a message indicating it was successful,
        otherwise an error message will be sent */
        try {
            await interaction.guild.members
                .ban(user, {
                    reason: interaction.options?.getString('reason')
                        ? `${interaction.options?.getString('reason')}`
                        : '',
                })
                .then(async () => {
                    return await interaction.reply({
                        content: `🔨 Banned \`${user.tag} (${user.id})\`.`,
                        ephemeral: true,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    return interaction.reply({
                        content:
                            '❌ I cannot ban this user! \n**Please make sure that my highest role is above theirs.**',
                        ephemeral: true,
                    });
                });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: `❌ I encountered an error while trying to ban \`${user.tag}\`: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                ephemeral: true,
            });
        }
    },
};
