import { coreLog, errorLog } from '../utils/logs';
import { clean, exec, generateBasicErrorEmbed } from '../utils/misc';
import { Client, Message } from 'discord.js';

export default {
    name: 'deploy',
    description: 'Compiles TypeScript code and then restarts the bot.',
    aliases: ['deployment', 'dep', 'update', 'upd'],
    ownerOnly: true,
    cooldown: 0,
    do: async (message: Message, client: Client) => {
        const logMessage: Message = await coreLog(
            `🔃 Deployment initiated by \`${message.author.tag} (${message.author.id})\`.`,
            client,
            { noWebhook: true },
        );
        const depMessage: Message = await message.channel.send('📝 Compiling TypeScript code...');
        const start: number = Date.now();
        try {
            const { stderr } = await exec('npx tsc');
            if (stderr) throw stderr;
        } catch (stderr) {
            console.error('Error compiling TypeScript code: \n', stderr);

            const embed = await generateBasicErrorEmbed('Deployment TypeScript Compilation Error', stderr, message);
            errorLog(embed, client, { noWebhook: true });

            logMessage.edit(`${logMessage.content}\n\n❌ Deployment resulted in error.`);
            return depMessage.edit(
                `❌ There was an error while compiling TypeScript code: \`\`\`js\n${clean(stderr)}\`\`\``,
            );
        }

        const end: number = Date.now();
        const compilationTime: number = (end - start) / 1000;
        const sec: string = compilationTime === 1 ? 'second' : 'seconds';
        await logMessage.edit(
            `${logMessage.content}\n\n✅ Compiled in ${compilationTime.toFixed(1)} ${sec}.\n\n🔄 Shutting down.`,
        );
        await depMessage.edit(`✅ Compilation finished in ${compilationTime.toFixed(1)} ${sec}. Shutting down...`);
        process.exit();
    },
};
