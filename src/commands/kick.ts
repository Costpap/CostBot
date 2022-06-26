import { CommandInteraction, Permissions } from 'discord.js';

export default {
    name: 'kick',
    description: 'Kicks the mentioned user from your server.',
    defaultPermission: true,
    options: [
        {
            name: 'user',
            description: 'User to kick',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason for kicking the user',
            type: 'STRING',
        },
    ],
    run: async (interaction: CommandInteraction) => {
        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Kick Members` in order to execute this command.',
                ephemeral: true,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({ content: '❌ Unknown permissions. Please try again later.', ephemeral: true });
        else if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply({
                content: '⛔ You need the `Kick Members` permission in order to use this command!',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('user', true);
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: '❌ You need to specify a valid user to kick!', ephemeral: true });
        }
        /* This checks if the user to be kicked is the person who sent the command,
        and if true, it prevents them from kicking themselves. */
        if (member.id === interaction.user.id) {
            return interaction.reply({ content: "Aww, please don't kick yourself! 💖", ephemeral: true });
        }
        if (member.kickable === false) {
            return interaction.reply({
                content: '❌ I cannot kick this user! \n**Please make sure that my highest role is above theirs.**',
                ephemeral: true,
            });
        }

        /* Attempts to kick the user. If the kick is successful,
        the bot will send a message indicating it was successful,
        otherwise an error message will be sent */
        try {
            await member.kick(
                interaction.options?.getString('reason') ? `${interaction.options?.getString('reason')}` : '',
            );
            interaction.reply({ content: `🔨 Kicked \`${member.user.tag} (${member.id})\`.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: `❌ I encountered an error while trying to kick \`${member.user.tag}\`: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                ephemeral: true,
            });
        }
    },
};
