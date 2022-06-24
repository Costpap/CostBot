import { clean, exec, parseCodeblock } from '../utils/misc';
import { inspect } from 'util';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';

export default {
    name: 'shell',
    description: 'Executes Shell code.',
    options: [
        {
            name: 'code',
            description: 'The code to execute',
            type: 'STRING',
            required: true,
        },
    ],
    defaultPermission: false,
    run: async (interaction: CommandInteraction, client: Client) => {
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

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Execution Successful')
                .addField('📥 Input', `\`\`\`bash\n${code}\`\`\``)
                .setTimestamp()
                .setFooter({
                    text: `Execution time: ${Math.round(Date.now() - before)}ms`,
                    iconURL: client.user.displayAvatarURL({ format: 'png' }),
                });
            if (stdout) {
                embed.addField('🖥 stdout', `\`\`\`bash\n${clean(stdout)}\`\`\``);
            }
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Shell:', error);
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Execution Error')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
                    { name: '❌ Error message', value: `\`\`\`js\n${error.message}\`\`\`` },
                )
                .setTimestamp()
                .setFooter({
                    text: `Execution time: ${Math.round(Date.now() - before)}ms`,
                    iconURL: client.user.displayAvatarURL({ format: 'png' }),
                });
            interaction.editReply({ embeds: [embed] });
        }
    },
};
