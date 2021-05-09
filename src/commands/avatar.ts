import { Message, Client, User } from 'discord.js';
import { parseUserMention } from '../utils/parse';

export default {
    name: 'avatar',
    description: 'Get the avatar of the mentioned user or yourself.',
    aliases: ['icon', 'pfp'],
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
        let user: User;
        if (!args[0]) user = message.author;
        else user = parseUserMention(args[0], client) || client.users.cache.get(args[0]);

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(user.tag, user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setDescription(`[Click here for URL](${user.displayAvatarURL({ format: 'png', dynamic: true })}?size=4096)`)
            .setImage(user.displayAvatarURL({ format: 'png', dynamic: true }) + "?size=1024")
            .setTimestamp()
            .setFooter(
                `Requested by ${message.author.tag}`,
                message.author.displayAvatarURL({ format: 'png', dynamic: true }),
            );

        message.channel.send(embed);
    },
};
