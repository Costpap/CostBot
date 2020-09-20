import { botOwner, repository } from '../botconfig';
import { Message, Client, User } from 'discord.js';

export default {
    name: 'legal',
    description: 'Shows legal info related to privacy and licensing.',
    aliases: ['priv', 'privacy', 'license'],
    permissions: ['EMBED_LINKS'],
    cooldown: 10,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
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
                message.channel.send(
                    `❌ Encountered an error while getting owner information: \`\`\`js\n${error}\`\`\``,
                );
            }
        }
        /**
         * @const
         * @param {string} lastUpdated - Shows the last time the Privacy Policy was updated and as of when it's effective.
         * @param {string} permNote - A permission warning shown to users in case they're unable to see the embed.
         * @param {string} privacy - Shows the bot's Privacy Policy.
         * @param {string} license - Shows information about the bot's license.
         */
        const strings = {
            lastUpdated: 'Last updated and effective: September 4th, 2020',
            permNote:
                '**⚠ You may need to enable `Show website preview info from links pasted into chat` under User Settings -> Text & Images in order to see the information below properly.**',
            privacy: `Please send a Direct Message to ${
                owner.length > 1 ? 'one of the following people:' : ''
            } \`${owner.join(', ')}\` in order to obtain a copy of the Privacy Policy.`,
            license: `${client.user.username} is licensed under the MIT license. You may obtain a copy of the license by going [here](${repository}/blob/master/LICENSE).`,
        };
        const embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setAuthor(strings.lastUpdated, client.user.displayAvatarURL({ format: 'png' }))
            .setTimestamp();

        switch (args[0]) {
            case 'priv':
            case 'privacy':
                embed.setTitle(`${client.user.username} Privacy Information`);
                embed.setDescription(strings.privacy);

                break;
            case 'license':
                embed.setTitle(`${client.user.username} License Information`);
                embed.setDescription(strings.license);

                break;
            default:
                embed.setTitle(`${client.user.username} Legal Information`);
                embed.addFields(
                    { name: 'Privacy Policy', value: strings.privacy },
                    { name: 'License', value: strings.license },
                );
                break;
        }

        try {
            await message.author.send(strings.permNote, embed);
            if (message.channel.type === 'dm') return;
            return message.channel.send('✅ The information you requested has been sent.');
        } catch (error) {
            console.error(`Could not send legal DM to ${message.author.tag} (${message.author.id}):\n`, error);
            return message.channel.send(strings.permNote, embed);
        }
    },
};
