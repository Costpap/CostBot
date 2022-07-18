import {
    ChatInputCommandInteraction,
    Client,
    OAuth2Scopes,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('invite').setDescription('Sends you a link to invite the bot.'),
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
