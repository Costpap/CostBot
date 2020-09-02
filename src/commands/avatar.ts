import { Message, Client, User } from 'discord.js';
import { parseUserMention } from '../utils/parse';

export default {
    name: 'avatar',
    description: 'Get the avatar of the mentioned user or yourself.',
    aliases: ['icon', 'pfp'],
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
        const user: User = parseUserMention(args[0], client) || client.users.cache.get(args[0]) || message.author;
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(user.tag, user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setDescription(`[Click here for URL](${user.displayAvatarURL({ format: 'png', dynamic: true })})`)
            .setImage(user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setTimestamp()
            .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({ format: 'png', dynamic: true }),
            );

        message.channel.send(embed);
    },
};
