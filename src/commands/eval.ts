import { clean, parseCodeblock } from '../utils/misc';
import { inspect } from 'util';
import { Message, Client } from 'discord.js';

export default {
    name: 'eval',
    description: 'Runs JavaScript code.',
    ownerOnly: true,
    usage: 'code',
    args: true,
    permissions: ['EMBED_LINKS'],
    cooldown: 0,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
        const before: number = Date.now();
        let code: string = parseCodeblock(args.join(' '));
        try {
            let evaled = await eval(code);

            if (typeof evaled !== 'string') {
                evaled = inspect(evaled);
            }

            /* This checks if the input and output are over 1024 characters long
            (1016 characters with codeblock), and if so, it replaces them,
            in order to prevent the embed from raising an uncaught exception. */
            if (code.length > 1016) {
                code = '"The input cannot be displayed as it is longer than 1024 characters."';
            }
            if (evaled.length > 1016) {
                console.log('Eval Output:\n', clean(evaled));
                evaled =
                    '"The output cannot be displayed as it is longer than 1024 characters. Please check the console."';
            }

            const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Evaluation Successful')
                .addFields(
                    { name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
                    { name: '📤 Output', value: `\`\`\`js\n${clean(evaled)}\`\`\`` },
                )
                .setTimestamp()
                .setFooter(
                    `Execution time: ${Math.round(Date.now() - before)}ms`,
                    client.user.displayAvatarURL({ format: 'png' }),
                );

            message.channel.send(embed);
        } catch (error) {
            console.error('Eval:', error);
            const embed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Evaluation Error')
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
