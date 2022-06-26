import { Client, CommandInteraction, MessageEmbed, User, version as libraryVersion } from 'discord.js';
import { botOwner, repository } from '../botconfig';
import { clientStats } from '../utils/misc';
import { version } from '../utils/version';

export default {
    name: 'info',
    description: 'Displays information about the bot.',
    defaultPermission: true,
    run: async (interaction: CommandInteraction, client: Client) => {
        /* This automatically gets the user IDs from the botconfig,
        fetches the users and pushes their username, discriminator and ID to an array,
        which is then shown on an embed field. */
        /**
         * Array containing: **developer name#0000 (`123456789012345678`)**
         */
        const developers: string[] = [];
        for (const developer of botOwner) {
            try {
                const dev: User = await client.users.fetch(developer);
                developers.push(`${dev.tag} (\`${dev.id}\`)`);
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: `❌ Encountered an error while getting developer information: \`\`\`js\n${error}\`\`\``,
                    ephemeral: true,
                });
            }
        }

        const embed = new MessageEmbed()
            .setColor(0x6293f5)
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setTitle(`${client.user.username} Information`)
            .addFields(
                { name: `${developers.length > 1 ? 'Developers' : 'Developer'}`, value: `${developers.join('\n')}` },
                { name: 'Version', value: `${await version()}`, inline: true },
                { name: 'Library', value: `discord.js v${libraryVersion}`, inline: true },
                { name: 'Number of commands', value: `${client.commands.size}`, inline: true },
                { name: 'GitHub Repository', value: `${repository}`, inline: true },
                { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp();
        clientStats(embed, client, { membersExcludingBots2: true });
        interaction.reply({ embeds: [embed] });
    },
};
