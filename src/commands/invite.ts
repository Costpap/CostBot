import { Client, CommandInteraction, Permissions } from 'discord.js';

export default {
    name: 'invite',
    description: 'Sends you a link to invite the bot.',
    defaultPermission: true,
    run: async (interaction: CommandInteraction, client: Client) => {
        const link: string = client.generateInvite({
            scopes: ['bot', 'applications.commands'],
            permissions: [
                Permissions.FLAGS.KICK_MEMBERS,
                Permissions.FLAGS.BAN_MEMBERS,
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.MANAGE_MESSAGES,
                Permissions.FLAGS.EMBED_LINKS,
                Permissions.FLAGS.READ_MESSAGE_HISTORY,
            ],
        });
        interaction.reply({ content: `You can invite me to your server [here](${link}).`, ephemeral: true });
    },
};
