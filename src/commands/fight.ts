import { Message, Client, GuildMember } from 'discord.js';
import { parseMemberMention } from '../utils/parse';

export default {
    name: 'fight',
    description: 'Have a little online fight with someone.',
    args: true,
    guildOnly: true,
    usage: 'person you want to fight',
    cooldown: 10,
    do: async (message: Message, client: Client, args: string[]) => {
        const member: GuildMember =
            parseMemberMention(args[0], message.guild) ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find((m) => m.user.username === args[0] || m.user.tag === args[0]);

        if (!member) {
            return message.channel.send('❌ You need to specify a user to fight.');
        }
        if (member.id === message.member.id) {
            return message.channel.send('Why would you fight yourself? Have a little hug from me! 🤗');
        }
        if (member.id === client.user.id) {
            return message.channel.send('Why would you fight me? 😔');
        }

        /**
         * Array containing a list of strings that can be used for the command.
         * One of them is randomly selected by `fightString` on execution.
         * Feel free to add your strings in the array
         * if you'd like to see them used in the command.
         */
        const fightStrings: string[] = [
            `${member}, you are being fought by ${message.member}!`,
            `${member}, ${message.member} is fighting you!`,
            `${member} just got tackled down by ${message.member}!`,
            `${message.member} is having a small fight with ${member}.`,
            `${message.member} is fighting with ${member}. Oh no.`,
            `${message.member} is trying to fight ${member} but it didn't turn out that well.`,
            `${message.member} tried to fight ${member}, but it didn't end well at all.`,
            `${message.member} tried to tackle down ${member} but accidentally fell instead!`,
            `${message.member} tried to hug ${member}, but fought them in confusion.`,
        ];
        /**
         * Randomly picks a string from the `fightStrings` array in order to send to the user.
         * @returns {string} Random string from `fightStrings` array.
         */
        const fightString: string = fightStrings[Math.floor(Math.random() * fightStrings.length)];

        try {
            message.channel.send(fightString);
        } catch (error) {
            console.error(error);
            message.channel.send(
                `❌ Sorry, I couldn't fight ${member.user.tag} for you: \`\`\`js\n${error.message}\`\`\``,
            );
        }
    },
};
