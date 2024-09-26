import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Watch Anime!'),
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        interaction.reply({ content: '[Click here to watch Anime](https://www.youtube.com/watch?v=QB7ACr7pUuE)' });
    },
};
