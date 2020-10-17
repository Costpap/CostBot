import { Message, Client, User } from 'discord.js';
import { parseUserMention } from '../utils/parse';

export default {
    name: 'ban',
    level: 'admin',
    description: 'Bans the @mentioned user from your server.',
    guildOnly: true,
    usage: '@member (optional reason)',
    permissions: ['BAN_MEMBERS'],
    cooldown: 10,
    do: async (message: Message, client: Client, args: string[]) => {
        if (!message.member.hasPermission('BAN_MEMBERS', { checkAdmin: true, checkOwner: true })) {
            return message.channel.send('⛔ You need the `Ban Members` permission in order to use this command!');
        }

        const user: User = parseUserMention(args[0], client) || client.users.cache.get(args[0]);
        if (!user) {
            return message.channel.send('❌ You need to specify a user to ban!');
        }
        /* This checks if the user to be banned
        is the person who sent the message,
        and if true, it prevents them
        from banning themselves. */
        if (user.id === message.author.id) {
            return message.channel.send("Aww, please don't ban yourself! 💖");
        }
        /* This checks if the user to be banned
        is in the guild, and if true,
        it checks if they can be banned by the bot or not. */
        if (!message.guild.member(user)?.bannable) {
            return message.channel.send(
                '❌ I cannot ban this user! \n**Please make sure that my highest role is above theirs.**',
            );
        }
        try {
            message.guild.members.ban(user, { reason: args.slice(1).join(' ') });
            message.channel.send(`🔨 Banned \`${user.tag} (${user.id})\`.`);
        } catch (error) {
            console.error(error);
            message.channel.send(
                `❌ I encountered an error while trying to ban \`${user.tag}\`: \n\`\`\`${error.message}\`\`\``,
            );
        }
    },
};
