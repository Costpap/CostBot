import { Message, Client, GuildMember } from 'discord.js';
import { parseMemberMention } from '../utils/parse';

export default {
    name: 'manageable',
    description: 'Shows if the bot can manage this user or not.',
    aliases: ['mod-able', 'modable'],
    guildOnly: true,
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, _client: Client, args: string[], Discord: typeof import('discord.js')) => {
        let member: GuildMember;
        if (!args[0]) member = message.member;
        else member = parseMemberMention(args[0], message.guild) || message.guild.members.cache.get(args[0]);
        const embed = new Discord.MessageEmbed()
            .setColor(member.displayHexColor)
            .setTitle(`Moderation Status for ${member.user.tag} (${member.id})`)
            .addFields(
                { name: 'Manageable', value: member.manageable, inline: true },
                { name: 'Kickable', value: member.kickable, inline: true },
                { name: 'Bannable', value: member.bannable, inline: true },
            )
            .setTimestamp()
            .setFooter(
                `Requested by ${message.author.tag}`,
                `${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`,
            );

        message.channel.send(embed);
    },
};
