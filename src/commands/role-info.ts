import { ChatInputCommandInteraction, EmbedBuilder, Role } from 'discord.js';
import { parseDate } from '../utils/misc';

export default {
    name: 'role-info',
    description: 'Displays information about a role.',
    options: [
        {
            name: 'role',
            description: 'Role to get information on',
            type: 'ROLE',
            required: true,
        },
        {
            name: 'show_members',
            description: "Whether to show the role's members",
            type: 'BOOLEAN',
        },
        {
            name: 'show_permissions',
            description: "Whether to show the role's permissions",
            type: 'BOOLEAN',
        },
    ],
    defaultPermission: true,
    run: async (interaction: ChatInputCommandInteraction) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        if (interaction.inGuild() === false) {
            return interaction.reply({ content: "❌ I can't execute this command inside DMs!", ephemeral: true });
        }
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
