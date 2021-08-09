import { version } from '../utils/misc';
import type { Command } from '../typings';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';

export default {
    name: 'help',
    description: "Lists all of the bot's commands and describes what they do.",
    defaultPermission: true,
    run: async (interaction: CommandInteraction, client: Client) => {
        const embed = new MessageEmbed()
            .setColor(0x6293f5)
            .setTitle("Here's a list of all my commands:")
            .setTimestamp()
            .setFooter(`${client.user.username} ${await version()}`, client.user.displayAvatarURL({ format: 'png' }));

        client.commands.forEach((command: Command) => {
            embed.addField(`/${command.name}`, command.description || 'No description');
        });

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
