import { Message, Client, GuildMember } from 'discord.js';
import { parseMemberMention } from '../utils/parse';

export default {
    name: 'hug',
    level: 'user',
    description: 'Give a sweet little hug to someone!',
    args: true,
    guildOnly: true,
    usage: 'person you want to hug',
    cooldown: 10,
    do: async (message: Message, client: Client, args: string[]) => {
        const member: GuildMember =
            parseMemberMention(args[0], message.guild) ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find((m) => m.user.username === args[0] || m.user.tag === args[0]);

        if (!member) {
            return message.channel.send('❌ You need to specify a user to hug!');
        }
        if (member.id === message.member.id) {
            return message.channel.send('Why do you want to hug yourself? You can have a hug from me instead! 🤗');
        }
        if (member.id === client.user.id) {
            return message.channel.send('Aww, thanks for hugging me! 💖');
        }

        /**
         * Array containing a list of strings that can be used for the command.
         * One of them is randomly selected by `hugString` on execution.
         * Feel free to add your strings in the array
         * if you'd like to see them used in the command.
         */
        const hugStrings: string[] = [
            `${member} just received a big hug from ${message.member}!`,
            `${member}, you have received a hug from ${message.member}!`,
            `${message.member} has hugged ${member}. How sweet!`,
            `${message.member} awkwardly gave a hug to ${member}.`,
            `${message.member} gave a very friendly hug to ${member}.`,
            `${message.member} has given ${member} a small hug.`,
            `${message.member} just gave ${member} a small hug.`,
            `${message.member} gave a hug to ${member}, but where is mine?`,
            `${message.member} wanted to fight ${member}, but gave them a hug in confusion.`,
        ];
        /**
         * Randomly picks a string from the `hugStrings` array in order to send to the user.
         * @returns {string} Random string from `hugStrings` array.
         */
        const hugString: string = hugStrings[Math.floor(Math.random() * hugStrings.length)];

        try {
            message.channel.send(hugString);
        } catch (error) {
            console.error(error);
            message.channel.send(
                `❌ Sorry, I couldn't hug ${member.user.tag} for you: \`\`\`js\n${error.message}\`\`\``,
            );
        }
    },
};
