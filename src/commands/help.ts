import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../typings';
import { version } from '../utils/version';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Lists all of the bot's commands and describes what they do"),
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        const embed = new EmbedBuilder()
            .setColor(0x6293f5)
            .setTitle("Here's a list of all my commands:")
            .setTimestamp()
            .setFooter({
                text: `${client.user.username} ${await version()}`,
                iconURL: client.user.displayAvatarURL({ extension: 'png' }),
            });

        client.commands.forEach((command: Command) => {
            embed.addFields([{ name: `/${command.data.name}`, value: command.data.description || 'No description' }]);
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
