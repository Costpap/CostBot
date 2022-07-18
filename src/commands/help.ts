import { ChatInputCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import type { Command } from '../typings';
import { version } from '../utils/version';

export default {
    name: 'help',
    description: "Lists all of the bot's commands and describes what they do.",
    defaultPermission: true,
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
            embed.addFields([{ name: `/${command.name}`, value: command.description || 'No description' }]);
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
