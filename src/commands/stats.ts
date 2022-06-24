import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { clientStats } from '../utils/misc';
import { version } from '../utils/version';

export default {
    name: 'stats',
    description: 'Displays statistics about this bot.',
    defaultPermission: true,
    run: async (interaction: CommandInteraction, client: Client) => {
        const embed = new MessageEmbed()
            .setColor(0x6293f5)
            .setTitle(`${client.user.username} Statistics`)
            .setTimestamp()
            .setFooter({
                text: `${client.user.username} ${await version()}`,
                iconURL: client.user.displayAvatarURL({ format: 'png' }),
            });
        clientStats(embed, client, { membersExcludingBots: true });
        interaction.reply({ embeds: [embed] });
    },
};
