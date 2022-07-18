import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import { clientStats } from '../utils/misc';
import { version } from '../utils/version';

export default {
    name: 'stats',
    description: 'Displays statistics about this bot.',
    defaultPermission: true,
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        const embed = new EmbedBuilder()
            .setColor(0x6293f5)
            .setTitle(`${client.user.username} Statistics`)
            .setTimestamp()
            .setFooter({
                text: `${client.user.username} ${await version()}`,
                iconURL: client.user.displayAvatarURL({ extension: 'png' }),
            });
        clientStats(embed, client, { membersExcludingBots: true });
        interaction.reply({ embeds: [embed] });
    },
};
