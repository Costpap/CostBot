import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Give a sweet little hug to someone!')
        .addUserOption((option) => option.setName('user').setDescription('User you want to hug').setRequired(true)),
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        const user = interaction.options.getUser('user', true);

        if (user.id === interaction.user.id) {
            return interaction.reply({
                content: 'Why do you want to hug yourself? You can have a hug from me instead! 🤗',
                ephemeral: true,
            });
        }
        if (user.id === client.user.id) {
            return interaction.reply({ content: 'Aww, thanks for hugging me! 💖', ephemeral: true });
        }

        /**
         * Array containing a list of strings that can be used for the command.
         * One of them is randomly selected by `hugString` on execution.
         * Feel free to add your strings in the array
         * if you'd like to see them used in the command.
         *
         * Notes about constants:
         * `${user.toString()}` is used for the member getting hugged,
         * and `${interaction.user.toString()}` is used for the person who is hugging them.
         */
        const hugStrings: string[] = [
            `${user.toString()} just received a big hug from ${interaction.user.toString()}!`,
            `${user.toString()}, you have received a hug from ${interaction.user.toString()}!`,
            `${interaction.user.toString()} just hugged ${user.toString()}. How sweet!`,
            `${interaction.user.toString()} awkwardly gave a hug to ${user.toString()}.`,
            `${interaction.user.toString()} gave a very friendly hug to ${user.toString()}.`,
            `${interaction.user.toString()} has given ${user.toString()} a small hug.`,
            `${interaction.user.toString()} just gave ${user.toString()} a small hug.`,
            `${interaction.user.toString()} gave a hug to ${user.toString()}, but where is mine?`,
            `${interaction.user.toString()} wants to strengthen their friendship with ${user.toString()}, so they gave them a cute little hug!`,
            `${interaction.user.toString()} wanted to fight ${user.toString()}, but gave them a hug in confusion.`,
        ];
        /**
         * Randomly picks a string from the `hugStrings` array in order to send to the user.
         * @returns {string} Random string from `hugStrings` array.
         */
        const hugString: string = hugStrings[Math.floor(Math.random() * hugStrings.length)];

        try {
            interaction.reply(hugString);
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: `❌ Sorry, I couldn't hug ${user.tag} for you: \`\`\`js\n${error?.message || error}\`\`\``,
                ephemeral: true,
            });
        }
    },
};
