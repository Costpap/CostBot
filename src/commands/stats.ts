import { clientStats, version } from '../utils/misc';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';

export default {
    name: 'stats',
    description: 'Displays statistics about this bot.',
    defaultPermission: true,
    run: async (interaction: CommandInteraction, client: Client) => {
        const embed = new MessageEmbed()
            .setColor(0x6293f5)
            .setTitle(`${client.user.username} Statistics`)
            .setTimestamp()
            .setFooter(`${client.user.username} ${await version()}`, client.user.displayAvatarURL({ format: 'png' }));
        clientStats(embed, client, { membersExcludingBots: true });
        interaction.reply({ embeds: [embed] });
    },
};
