import type { Command } from '../typings/index';
import { coreLog, errorLog } from '../utils/logs';
import { clean, exec, generateBasicErrorEmbed } from '../utils/misc';
import { Client, CommandInteraction, Message } from 'discord.js';

export default {
    name: 'reload',
    description: 'Reloads a command.',
    options: [
        {
            name: 'name',
            description: 'The name of the command to reload',
            type: 'STRING',
            required: true,
        },
    ],
    defaultPermission: false,
    run: async (interaction: CommandInteraction, client: Client) => {
        const commandName: string = interaction.options.getString('name');
        const command: Command = await client.commands.get(commandName);

        if (!command) {
            return interaction.reply({
                content: `❌ There is no command with named \`${commandName}\`!`,
                ephemeral: true,
            });
        }

        interaction.deferReply({ ephemeral: true });
        const logMessage: Message = await coreLog(
            `🔁 Reload of command **${command.name}** initiated by \`${interaction.user.tag} (${interaction.user.id})\`.`,
            [],
            client,
            { noWebhook: true },
        );
        const start: number = Date.now();
        try {
            const { stderr } = await exec('npx tsc');
            if (stderr) throw stderr;
        } catch (stderr) {
            console.error('Error compiling TypeScript code: \n', stderr);

            const embed = await generateBasicErrorEmbed(
                `TypeScript Compilation Error while reloading command \`${command.name}\``,
                stderr,
                interaction,
            );
            errorLog('', [embed], client, { noContent: true });

            logMessage.edit(
                `${logMessage.content}\n\n❌ There was an error while reloading command \`${command.name}\`.`,
            );
            return interaction.editReply(
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
            await interaction.editReply(
                `✅ Command **${command.name}** was reloaded in ${reloadTime.toFixed(1)} ${sec}!`,
            );
        } catch (error) {
            console.error(error);

            const embed = await generateBasicErrorEmbed('Reload Miscellaneous Error', error, interaction);
            errorLog('', [embed], client, { noContent: true });

            logMessage.edit(
                `${logMessage.content}\n\n❌ There was an error while reloading command \`${command.name}\`.`,
            );
            interaction.editReply(
                `❌ There was an error while reloading command \`${command.name}\`:\n\`\`\`js\n${
                    error?.message || error
                }\`\`\``,
            );
        }
    },
};
