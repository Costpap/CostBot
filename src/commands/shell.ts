import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { inspect } from 'util';
import { clean, exec, parseCodeblock } from '../utils/misc';

export default {
    data: new SlashCommandBuilder()
        .setName('shell')
        .setDescription('Executes Shell code.')
        .addStringOption((option) => option.setName('code').setDescription('The code to execute').setRequired(true))
        .setDefaultMemberPermissions(0),
    internals: {
        privileged: true,
    },
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        await interaction.deferReply({ ephemeral: true });
        let code: string = parseCodeblock(interaction.options.getString('code'));

        const before: number = Date.now();
        try {
            let { stdout } = await exec(code);

            if (typeof stdout !== 'string') {
                stdout = inspect(stdout);
            }

            /* This checks if the input and output are over 1024 characters long
            (1016 characters with codeblock), and if so, it replaces them,
            in order to prevent the embed from raising an uncaught exception. */
            if (code.length > 1014) {
                code = '"The input cannot be displayed as it is longer than 1024 characters."';
            }
            if (stdout.length > 1014) {
                console.log('Shell Output:\n', clean(stdout));
                stdout =
                    '"The output cannot be displayed as it is longer than 1024 characters. Please check the console."';
            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Execution Successful')
                .addFields([{ name: '📥 Input', value: `\`\`\`bash\n${code}\`\`\`` }])
                .setTimestamp()
                .setFooter({
                    text: `Execution time: ${Math.round(Date.now() - before)}ms`,
                    iconURL: client.user.displayAvatarURL({ extension: 'png' }),
                });
            if (stdout) {
                embed.addFields([{ name: '🖥 stdout', value: `\`\`\`bash\n${clean(stdout)}\`\`\`` }]);
            }
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Shell:', error);
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Execution Error')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
                    { name: '❌ Error message', value: `\`\`\`js\n${error.message}\`\`\`` },
                )
                .setTimestamp()
                .setFooter({
                    text: `Execution time: ${Math.round(Date.now() - before)}ms`,
                    iconURL: client.user.displayAvatarURL({ extension: 'png' }),
                });
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
