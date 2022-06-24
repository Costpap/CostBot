import { Client, CommandInteraction } from 'discord.js';

export default {
    name: 'fight',
    description: 'Have a little online fight with someone.',
    options: [
        {
            name: 'user',
            description: 'User you want to fight',
            type: 'USER',
            required: true,
        },
    ],
    defaultPermission: true,
    run: async (interaction: CommandInteraction, client: Client) => {
        const user = interaction.options.getUser('user', true);

        if (user.id === interaction.user.id) {
            return interaction.reply({
                content: 'Why would you fight yourself? Have a little hug from me! 🤗',
                ephemeral: true,
            });
        }
        if (user.id === client.user.id) {
            return interaction.reply({ content: 'Why would you fight me? 😔', ephemeral: true });
        }

        /**
         * Array containing a list of strings that can be used for the command.
         * One of them is randomly selected by `fightString` on execution.
         * Feel free to add your strings in the array
         * if you'd like to see them used in the command.
         *
         * Notes about constants:
         * `${member}` is used for the member getting fought,
         * and `${message.member}` is used for the person who is fighting them.
         */
        const fightStrings: string[] = [
            `${user.toString()}, you are being fought by ${interaction.user.toString()}!`,
            `${user.toString()}, ${interaction.user.toString()} is fighting you!`,
            `${user.toString()} just got tackled down by ${interaction.user.toString()}!`,
            `${interaction.user.toString()} is having a small fight with ${user.toString()}.`,
            `${interaction.user.toString()} is fighting with ${user.toString()}. Oh no.`,
            `${interaction.user.toString()} is trying to fight ${user.toString()} but it didn't turn out that well.`,
            `${interaction.user.toString()} tried to fight ${user.toString()}, but it didn't end well at all.`,
            `${interaction.user.toString()} tried to tackle down ${user.toString()} but accidentally fell instead!`,
            `${interaction.user.toString()} got jealous over ${user.toString()} and decided to have a fight with them.`,
            `${interaction.user.toString()} tried to hug ${user.toString()}, but fought them in confusion.`,
        ];
        /**
         * Randomly picks a string from the `fightStrings` array in order to send to the user.
         * @returns {string} Random string from `fightStrings` array.
         */
        const fightString: string = fightStrings[Math.floor(Math.random() * fightStrings.length)];

        try {
            interaction.reply(fightString);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: `❌ Sorry, I couldn't fight ${user.tag} for you: \`\`\`js\n${error?.message || error}\`\`\``,
                ephemeral: true,
            });
        }
    },
};
