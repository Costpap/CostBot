import { Message, Client, User } from 'discord.js';
import { parseUserMention } from '../utils/parse';

export default {
    name: 'anime',
    description: 'Show an anime girl saying "poggers"',
    aliases: ['poggers', 'animegirl'],
    permissions: ['EMBED_LINKS'],
    cooldown: 3,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
       
        const embed = new Discord.MessageEmbed()
            .setColor('#e0a899')
            .setTitle('CostBot is an actual anime bot, and here's the proof')
          
            .setImage("https://cdn.discordapp.com/attachments/693861342049861653/735252379750105178/video0.mp4")
            .setTimestamp()
            .setFooter(
                `Requested by ${message.author.tag} (weeb)`,
                message.author.displayAvatarURL({ format: 'png', dynamic: true }),
            );
        message.channel.send(embed);
    },
};
