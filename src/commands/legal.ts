import { ChatInputCommandInteraction, Client, EmbedBuilder, MessageFlags, SlashCommandBuilder, User } from 'discord.js';
import { botOwner, repository } from '../botconfig';

export default {
    data: new SlashCommandBuilder()
        .setName('legal')
        .setDescription('Shows legal info related to privacy and licensing.')
        .addStringOption((option) =>
            option
                .setName('type')
                .setDescription("The type of information you'd like to see")
                .addChoices(
                    { name: 'Privacy', value: 'privacy' },
                    { name: 'License', value: 'license' },
                    { name: 'Show me both of them!', value: 'both' },
                )
                .setRequired(true),
        ),
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        /* This automatically gets the user IDs from the botconfig,
        fetches the users and pushes their username, discriminator and ID to an array,
        which is then shown on the Privacy Policy of the bot. */
        /**
         * Array containing: **owner name#0000 (`123456789012345678`)**
         */
        const owner: string[] = [];
        for (const ownr of botOwner) {
            try {
                const own: User = await client.users.fetch(ownr);
                owner.push(`${own.tag} (${own.id})`);
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: `❌ Encountered an error while getting owner information: \`\`\`js\n${error}\`\`\``,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
        /**
         * @const
         * @property {string} lastUpdated - Shows the last time the Privacy Policy was updated and as of when it's effective.
         * @property {string} permNote - A permission warning shown to users in case they're unable to see the embed.
         * @property {string} privacy - Shows the bot's Privacy Policy.
         * @property {string} license - Shows information about the bot's license.
         */
        const strings = {
            lastUpdated: 'Last updated and effective: September 4, 2020',
            permNote:
                '**⚠ You may need to enable `Show website preview info from links pasted into chat` under User Settings -> Text & Images in order to see the information below properly.**',
            privacy: `Please send a Direct Message to ${
                owner.length > 1 ? 'one of the following people:' : ''
            } \`${owner.join(', ')}\` in order to obtain a copy of the Privacy Policy.`,
            license: `${client.user.username} is licensed under the MIT license. You may obtain a copy of the license by going [here](${repository}/blob/main/LICENSE).`,
        };
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({
                name: strings.lastUpdated,
                iconURL: client.user.displayAvatarURL({ extension: 'png', forceStatic: false }),
            })
            .setTimestamp();

        switch (interaction.options.getString('type', true)) {
            case 'privacy':
                embed.setTitle(`${client.user.username} Privacy Information`);
                embed.setDescription(strings.privacy);

                break;
            case 'license':
                embed.setTitle(`${client.user.username} License Information`);
                embed.setDescription(strings.license);

                break;
            case 'both':
            default:
                embed.setTitle(`${client.user.username} Legal Information`);
                embed.addFields(
                    { name: 'Privacy Policy', value: strings.privacy },
                    { name: 'License', value: strings.license },
                );
                break;
        }

        try {
            await interaction.reply({ content: `${strings.permNote}`, embeds: [embed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            return console.error(
                `Could not send legal info to ${interaction.user.tag} (${interaction.user.id}):\n`,
                error,
            );
        }
    },
};
