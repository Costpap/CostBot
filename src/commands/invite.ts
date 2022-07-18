import { ChatInputCommandInteraction, Client, OAuth2Scopes, PermissionFlagsBits } from 'discord.js';

export default {
    name: 'invite',
    description: 'Sends you a link to invite the bot.',
    defaultPermission: true,
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        const link: string = client.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: [
                PermissionFlagsBits.KickMembers,
                PermissionFlagsBits.BanMembers,
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.ModerateMembers,
            ],
        });
        interaction.reply({ content: `You can invite me to your server [here](${link}).`, ephemeral: true });
    },
};
