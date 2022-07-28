import { ChatInputCommandInteraction, Client, Message, SlashCommandBuilder } from 'discord.js';
import { coreLog, errorLog } from '../utils/logs';
import { clean, exec, generateBasicErrorEmbed } from '../utils/misc';

export default {
    data: new SlashCommandBuilder()
        .setName('deploy')
        .setDescription('Compiles TypeScript code and then restarts the bot.')
        .setDefaultMemberPermissions(0),
    internals: {
        privileged: true,
    },
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        const logMessage: Message = await coreLog(
            `🔃 Deployment initiated by \`${interaction.user.tag} (${interaction.user.id})\`.`,
            [],
            client,
            { noWebhook: true },
        );
        await interaction.deferReply({ ephemeral: true });
        const start: number = Date.now();
        try {
            const { stderr } = await exec('npx tsc');
            if (stderr) throw stderr;
        } catch (stderr) {
            console.error('Error compiling TypeScript code: \n', stderr);

            const embed = await generateBasicErrorEmbed(
                'Deployment TypeScript Compilation Error',
                'Red',
                stderr,
                {},
                interaction,
            );
            errorLog('', [embed], client, { noContent: true });

            logMessage.edit(`${logMessage.content}\n\n❌ Deployment resulted in error.`);
            return interaction.editReply(
                `❌ There was an error while compiling TypeScript code: \`\`\`js\n${clean(stderr)}\`\`\``,
            );
        }

        const end: number = Date.now();
        const compilationTime: number = (end - start) / 1000;
        const sec: string = compilationTime === 1 ? 'second' : 'seconds';
        await logMessage.edit(
            `${logMessage.content}\n\n✅ Compiled in ${compilationTime.toFixed(1)} ${sec}.\n\n🔄 Shutting down.`,
        );
        await interaction.editReply(
            `✅ Compilation finished in ${compilationTime.toFixed(1)} ${sec}. Shutting down...`,
        );
        process.exit();
    },
};
