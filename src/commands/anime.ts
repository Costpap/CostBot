import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('important info'),
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        const animeStrings: string[] = [
            "Baka! Don't you know that anime is more than just a cartoon? It's a lifestyle, a culture, a passion. Get ready to become a true weeb with me by your side.",
            "anime",
            "ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME ANIME",
            "Costpap is a weeb",
            "My oh my! I love anime",
            "OwO! What's this? Did someone say anime? I'm all ears! Let's talk about our favorite characters, ships, and moments. Who's in for a good kawaii time?",
            "blushes M-My apologies, I seem to have become a little too excited. Let's get back to talking about anime. Who's your favorite waifu or husbando? I'm rooting for (insert character here).",
            "UwU, hewwo evwyone! I'm youw favowite anime bot, hewe to bwing you awl the wates and gweatest nyews fwom the anime wowld. Who's weady to have some fun?",
            "UwU, don't be shy, come and talk to me. I pwomise I won't bite. Wewl, unless you'we into that kind of thing. Then I might nibble a wittle.",
            "I am an anime bot",
        ];
        /**
         * Randomly picks a string from the `animeStrings` array in order to send to the user.
         * @returns {string} Random string from `animeStrings` array.
         */
        const animeString: string = animeStrings[Math.floor(Math.random() * animeStrings.length)];

        try {
            interaction.reply(animeString);
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: `❌: \`\`\`js\n${error?.message || error}\`\`\``,
                ephemeral: true,
            });
        }
    },
};

