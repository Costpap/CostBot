import { ChatInputCommandInteraction, EmbedBuilder, Role, SlashCommandBuilder } from 'discord.js';
import { parseDate } from '../utils/misc';

export default {
    data: new SlashCommandBuilder()
        .setName('role-info')
        .setDescription('Displays information about a role.')
        .addRoleOption((option) =>
            option.setName('role').setDescription('Role to get information on').setRequired(true),
        )
        .addBooleanOption((option) =>
            option.setName('show_members').setDescription("Whether to show the role's members").setRequired(false),
        )
        .addBooleanOption((option) =>
            option
                .setName('show_permissions')
                .setDescription("Whether to show the role's permissions")
                .setRequired(false),
        )
        .setDMPermission(false),
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        const apiRole = interaction.options.getRole('role', true);
        const role: Role = interaction.guild.roles.cache.get(apiRole.id);

        const embed = new EmbedBuilder()
            .setColor(role.hexColor)
            .setTitle(`**Role name:** ${role.name}`)
            .setDescription(`**Role mention:** ${role.toString()}\n**Role ID:** \`${role.id}\``)
            .addFields(
                { name: 'Role position', value: `${role.position}`, inline: true },
                { name: 'Hoisted', value: `${role.hoist ? 'Yes' : 'No'}`, inline: true },
                {
                    name: 'Mentionable',
                    value: `${role.mentionable ? 'Mentionable by everyone' : 'Only with permission'}`,
                    inline: true,
                },
                { name: 'Hex color', value: `${role.hexColor}`, inline: true },
                {
                    name: 'Role created',
                    value: `${parseDate(role.createdAt)}`,
                    inline: true,
                },
            )
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ extension: 'png', forceStatic: false }),
            });

        if (interaction.options?.getBoolean('show_members')) {
            embed.addFields([
                {
                    name: 'Role members',
                    value: `${
                        role.members.map((member) => member).join(', ') || 'There are no members with this role.'
                    }`,
                },
            ]);
        }

        if (interaction.options?.getBoolean('show_permissions')) {
            embed.addFields([
                {
                    name: 'Role permissions',
                    value: `${role.permissions.toArray().join(', ') || "This role doesn't have any permissions."}`,
                },
            ]);
        }

        interaction.reply({ embeds: [embed] });
    },
};
