import { Message, Client, User } from 'discord.js';
import { parseUserMention } from '../utils/parse';

export default {
    name: 'dm',
    description: 'Sends a direct message through the bot',
    adminOnly: true,
    args: true,
    usage: '@user text',
    permissions: ['MANAGE_MESSAGES'],
    cooldown: 5,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
        const dmUser: User = parseUserMention(args[0], client) || client.users.cache.get(args[0]);
        if (!dmUser) {
            return message.channel.send('❌ You need to specify a user to DM.');
        }
        if (dmUser.bot) {
            return message.channel.send('❌ You cannot send messages to bots.');
        }
        if (message.channel.type !== 'dm') message.delete();

        if (args[1] === 'embed') {
            /**
             * Determines what number should be used in order to slice arguments.
             */
            let sliceNumber: number;
            if (args[2] === 'name') sliceNumber = 3;
            else sliceNumber = 2;

            const embed = new Discord.MessageEmbed()
                .setColor(0x6293f5)
                .setDescription(args.slice(sliceNumber).join(' '))
                .setTimestamp();

            if (sliceNumber === 3) {
                embed.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }));
            }

            try {
                dmUser.send(embed);
                const sentMessage: Message = await message.channel.send(
                    `✅ Successfully sent DM to **${dmUser.tag}**!`,
                );
                return sentMessage.delete({ timeout: 5000 });
            } catch (error) {
                console.error(
                    `Could not send ${message.author.tag}'s (${message.author.id}) DM to ${dmUser.tag} (${dmUser.id}):\n`,
                    error,
                );
                return message.channel.send(`❌ Could not send message to ${dmUser.tag}`);
            }
        }

        try {
            dmUser.send(args.slice(1).join(' '));
            const sentMessage: Message = await message.channel.send(`✅ Successfully sent DM to **${dmUser.tag}**!`);
            return sentMessage.delete({ timeout: 5000 });
        } catch (error) {
            console.error(
                `Could not send ${message.author.tag}'s (${message.author.id}) DM to ${dmUser.tag} (${dmUser.id}):\n`,
                error,
            );
            return message.channel.send(`❌ Could not send message to **${dmUser.tag}**.`);
        }
    },
};
