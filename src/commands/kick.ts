import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { notifyUser } from '../utils/misc';

export default {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks the mentioned user from your server.')
        .addUserOption((option) => option.setName('user').setDescription('User to kick').setRequired(true))
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for kicking the user').setRequired(false),
        )
        .addBooleanOption((option) =>
            option.setName('silent').setDescription('Whether or not to DM the user').setRequired(false),
        )
        .setDMPermission(false),
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: '❌ Sorry, I need the `Kick Members` in order to execute this command.',
                flags: MessageFlags.Ephemeral,
            });
        }
        if (typeof interaction.member.permissions === 'string')
            return interaction.reply({
                content: '❌ Unknown permissions. Please try again later.',
                flags: MessageFlags.Ephemeral,
            });
        else if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: '⛔ You need the `Kick Members` permission in order to use this command!',
                flags: MessageFlags.Ephemeral,
            });
        }

        const user = interaction.options.getUser('user', true);
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({
                content: '❌ You need to specify a valid user to kick!',
                flags: MessageFlags.Ephemeral,
            });
        }

        /* This checks if the user to be kicked is the person who sent the command,
        and if true, it prevents them from kicking themselves. */
        if (member.id === interaction.user.id) {
            return interaction.reply({ content: "Aww, please don't kick yourself! 💖", flags: MessageFlags.Ephemeral });
        }
        if (member.kickable === false) {
            return interaction.reply({
                content: '❌ I cannot kick this user! \n**Please make sure that my highest role is above theirs.**',
                flags: MessageFlags.Ephemeral,
            });
        }

        let response = `🔨 Kicked \`${member.user.tag} (${member.id})\`.`;

        if (!interaction.options.getBoolean('silent')) {
            const notified = await notifyUser(user, interaction, 'kicked');
            if (!notified) response += "\n\n⚠️ Couldn't send DM to user.";
        }

        /* Attempts to kick the user. If the kick is successful,
        the bot will send a message indicating it was successful,
        otherwise an error message will be sent */
        try {
            await member.kick(
                interaction.options?.getString('reason') ? `${interaction.options?.getString('reason')}` : '',
            );
            interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: `❌ I encountered an error while trying to kick \`${member.user.tag}\`: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
