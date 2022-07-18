import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { version } from '../utils/version';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Pings the bot!'),
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        const createdTimestamp: number = Date.now();
        await interaction.deferReply();
        const embed = new EmbedBuilder()
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
                iconURL: client.user.displayAvatarURL({ extension: 'png' }),
            });
        interaction.editReply({ embeds: [embed] });
    },
};
