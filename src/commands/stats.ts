import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { clientStats } from '../utils/misc';
import { version } from '../utils/version';

export default {
    data: new SlashCommandBuilder().setName('stats').setDescription('Displays statistics about this bot.'),
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
