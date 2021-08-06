import { version } from '../utils/misc';
import { Client, Message, MessageEmbed } from 'discord.js';

export default {
    name: 'ping',
    description: 'Pings the bot!',
    permissions: ['EMBED_LINKS'],
    cooldown: 8,
    do: async (message: Message, client: Client) => {
        const createdTimestamp: number = Date.now();
        const sentMessage: Message = await message.channel.send('Pinging...');
        const embed = new MessageEmbed()
            .setColor(0x6293f5)
            .setTitle(`${client.user.username} Ping`)
            .addFields(
                {
                    name: 'Message Edit Time',
                    value: `${Date.now() - createdTimestamp}ms`,
                    inline: true,
                },
                { name: 'Websocket Heartbeat', value: `${client.ws.ping}ms`, inline: true },
            )
            .setTimestamp()
            .setFooter(`${client.user.username} ${await version()}`, client.user.displayAvatarURL({ format: 'png' }));
        sentMessage.edit('', embed);
    },
};
