import { ChatInputCommandInteraction, Client, Message, SlashCommandBuilder } from 'discord.js';
import type { Command } from '../typings/index';
import { coreLog, errorLog } from '../utils/logs';
import { clean, exec, generateBasicErrorEmbed } from '../utils/misc';

export default {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption((option) =>
            option.setName('name').setDescription('The name of the command to reload').setRequired(true),
        )
        .setDefaultMemberPermissions(0),
    internals: {
        privileged: true,
    },
    run: async (interaction: ChatInputCommandInteraction, client: Client) => {
        // Typeguard in order to ensure having access to ChatInputCommand interaction options.
        if (!interaction.isChatInputCommand()) return;

        const commandName: string = interaction.options.getString('name');
        const command: Command = await client.commands.get(commandName);

        if (!command) {
            return interaction.reply({
                content: `❌ There is no command named \`${commandName}\`!`,
                ephemeral: true,
            });
        }

        interaction.deferReply({ ephemeral: true });
        const logMessage: Message = await coreLog(
            `🔁 Reload of command **${command.data.name}** initiated by \`${interaction.user.tag} (${interaction.user.id})\`.`,
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
                `TypeScript Compilation Error while reloading command \`${command.data.name}\``,
                'Red',
                stderr,
                {},
                interaction,
            );
            errorLog('', [embed], client, { noContent: true });

            logMessage.edit(
                `${logMessage.content}\n\n❌ There was an error while reloading command \`${command.data.name}\`.`,
            );
            return interaction.editReply(
                `❌ There was an error while compiling TypeScript code: \`\`\`js\n${clean(stderr)}\`\`\``,
            );
        }

        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
            await import(`./${command.data.name}.js`).then(({ default: newCommand }) =>
                client.commands.set(newCommand.data.name, newCommand),
            );
            const end: number = Date.now();
            const reloadTime: number = (end - start) / 1000;
            const sec: string = reloadTime === 1 ? 'second' : 'seconds';
            await logMessage.edit(
                `${logMessage.content}\n\n✅ Command **${command.data.name}** was reloaded in ${reloadTime.toFixed(
                    1,
                )} ${sec}!`,
            );
            await interaction.editReply(
                `✅ Command **${command.data.name}** was reloaded in ${reloadTime.toFixed(1)} ${sec}!`,
            );
        } catch (error) {
            console.error(error);

            const embed = await generateBasicErrorEmbed('Reload Miscellaneous Error', 'Red', error, {}, interaction);
            errorLog('', [embed], client, { noContent: true });

            logMessage.edit(
                `${logMessage.content}\n\n❌ There was an error while reloading command \`${command.data.name}\`.`,
            );
            return interaction.editReply(
                `❌ There was an error while reloading command \`${command.data.name}\`:\n\`\`\`js\n${
                    error?.message || error
                }\`\`\``,
            );
        }
    },
};
