import { clean, exec, parseCodeblock } from '../utils/misc';
import { inspect } from 'util';
import { Message, Client } from 'discord.js';

export default {
    name: 'shell',
    level: 'owner',
    description: 'Runs Shell code.',
    ownerOnly: true,
    usage: 'code',
    args: true,
    permissions: ['EMBED_LINKS'],
    cooldown: 0,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
        const before: number = Date.now();
        let code: string = parseCodeblock(args.join(' '));
        try {
            let { stdout } = await exec(code);

            if (typeof stdout !== 'string') {
                stdout = await inspect(stdout);
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

            const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Execution Successful')
                .addField('📥 Input', `\`\`\`bash\n${code}\`\`\``)
                .setTimestamp()
                .setFooter(
                    `Execution time: ${Math.round(Date.now() - before)}ms`,
                    client.user.displayAvatarURL({ format: 'png' }),
                );
            if (stdout) {
                embed.addField('🖥 stdout', `\`\`\`bash\n${clean(stdout)}\`\`\``);
            }
            message.channel.send(embed);
        } catch (error) {
            console.error('Shell:', error);
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Execution Error')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
                    { name: '❌ Error message', value: `\`\`\`js\n${error.message}\`\`\`` },
                )
                .setTimestamp()
                .setFooter(
                    `Execution time: ${Math.round(Date.now() - before)}ms`,
                    client.user.displayAvatarURL({ format: 'png' }),
                );
            message.channel.send(embed);
        }
    },
};
