import type { Command } from '../typings/index';
import { coreLog, errorLog } from '../utils/logs';
import { clean, exec, generateBasicErrorEmbed } from '../utils/misc';
import { Client, Message } from 'discord.js';

export default {
    name: 'reload',
    description: 'Reloads a command.',
    ownerOnly: true,
    args: true,
    aliases: ['cmdr'],
    usage: '[command name]',
    cooldown: 0,
    do: async (message: Message, client: Client, args: string[]) => {
        const commandName: string = args[0].toLowerCase();
        const command: Command =
            client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases?.includes(commandName));

        if (!command) {
            return message.channel.send(`❌ There is no command with name or alias \`${commandName}\`!`);
        }

        const logMessage: Message = await coreLog(
            `🔁 Reload of command **${command.name}** initiated by \`${message.author.tag} (${message.author.id})\`.`,
            client,
            { noWebhook: true },
        );
        const sentMessage: Message = await message.channel.send('📝 Compiling TypeScript code...');
        const start: number = Date.now();
        try {
            const { stderr } = await exec('npx tsc');
            if (stderr) throw stderr;
        } catch (stderr) {
            console.error('Error compiling TypeScript code: \n', stderr);

            const embed = await generateBasicErrorEmbed(
                `TypeScript Compilation Error while reloading command \`${command.name}\``,
                stderr,
                message,
            );
            errorLog(embed, client, { noWebhook: true });

            logMessage.edit(
                `${logMessage.content}\n\n❌ There was an error while reloading command \`${command.name}\`.`,
            );
            return sentMessage.edit(
                `❌ There was an error while compiling TypeScript code: \`\`\`js\n${clean(stderr)}\`\`\``,
            );
        }

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            await import(`./${command.name}.js`).then(({ default: newCommand }) =>
                client.commands.set(newCommand.name, newCommand),
            );
            const end: number = Date.now();
            const reloadTime: number = (end - start) / 1000;
            const sec: string = reloadTime === 1 ? 'second' : 'seconds';
            await logMessage.edit(
                `${logMessage.content}\n\n✅ Command **${command.name}** was reloaded in ${reloadTime.toFixed(
                    1,
                )} ${sec}!`,
            );
            await sentMessage.edit(`✅ Command **${command.name}** was reloaded in ${reloadTime.toFixed(1)} ${sec}!`);
        } catch (error) {
            console.error(error);

            const embed = await generateBasicErrorEmbed('Reload Miscellaneous Error', error, message);
            errorLog(embed, client, { noWebhook: true });

            logMessage.edit(
                `${logMessage.content}\n\n❌ There was an error while reloading command \`${command.name}\`.`,
            );
            sentMessage.edit(
                `❌ There was an error while reloading command \`${command.name}\`:\n\`\`\`js\n${
                    error?.message || error
                }\`\`\``,
            );
        }
    },
};
