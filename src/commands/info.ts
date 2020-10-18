import { botOwner, repository } from '../botconfig';
import { clientStats, version } from '../utils/misc';
import { Message, Client, User } from 'discord.js';

export default {
    name: 'info',
    description: 'Displays information about the bot.',
    aliases: ['information', 'about'],
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, client: Client, _args: string[], Discord: typeof import('discord.js')) => {
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
                message.channel.send(
                    `❌ Encountered an error while getting developer information: \`\`\`js\n${error}\`\`\``,
                );
            }
        }

        const embed = new Discord.MessageEmbed()
            .setColor(0x6293f5)
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setTitle(`${client.user.username} Information`)
            .addFields(
                { name: developers.length > 1 ? 'Developers' : 'Developer', value: developers.join('\n') },
                { name: 'Version', value: await version(), inline: true },
                { name: 'Library', value: `discord.js v${Discord.version}`, inline: true },
                { name: 'Number of commands', value: client.commands.size, inline: true },
                { name: 'GitHub Repository', value: repository, inline: true },
                { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp();
        clientStats(embed, client, { noUptimeInline: true });
        message.channel.send(embed);
    },
};
