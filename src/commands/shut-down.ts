import { coreLog } from '../utils/logs';
import { Client, Message } from 'discord.js';

export default {
    name: 'shut-down',
    description: 'Shuts down the bot.',
    aliases: ['shutdown', 'shdn', 'restart', 'rst', 'reboot', 'rbt'],
    ownerOnly: true,
    cooldown: 0,
    do: async (message: Message, client: Client) => {
        coreLog(`🔄 Shutdown initiated by \`${message.author.tag} (${message.author.id})\`.`, client, {
            noWebhook: true,
        });
        console.log(`Shutdown initiated by ${message.author.tag} (${message.author.id}).`),
            await message.channel.send('✅ Shutting down...');
        process.exit();
    },
};
