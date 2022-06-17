import { version } from '../utils/misc';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';

export default {
    name: 'ping',
    description: 'Pings the bot!',
    defaultPermission: true,
    run: async (interaction: CommandInteraction, client: Client) => {
        const createdTimestamp: number = Date.now();
        await interaction.deferReply();
        const embed = new MessageEmbed()
            .setColor(0x6293f5)
            .setTitle(`${client.user.username} Ping`)
            .addFields(
                {
                    name: 'Response Time',
                    value: `${Date.now() - createdTimestamp}ms`,
                    inline: true,
                },
                { name: 'Websocket Heartbeat', value: `${client.ws.ping}ms`, inline: true },
            )
            .setTimestamp()
            .setFooter({
                text: `${client.user.username} ${await version()}`,
                iconURL: client.user.displayAvatarURL({ format: 'png' }),
            });
        interaction.editReply({ embeds: [embed] });
    },
};
