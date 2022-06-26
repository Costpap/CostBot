import { Client, Interaction } from 'discord.js';
import { errorLog } from '../utils/logs';
import { generateBasicErrorEmbed } from '../utils/misc';

export default {
    name: 'interactionCreate',
    run: async (client: Client, interaction: Interaction) => {
        if (!interaction.isCommand()) return;
        if (!client.commands.has(interaction.commandName)) return;

        try {
            await client.commands.get(interaction.commandName).run(interaction, client);
        } catch (error) {
            console.error(error);

            const embed = await generateBasicErrorEmbed(
                `Generic command \`${interaction.commandName}\` error`,
                error,
                interaction,
            );
            errorLog('', [embed], client, { noContent: true });
            return interaction.reply({
                content: `❌ I encountered an error while trying to execute this command: \n\`\`\`${
                    error?.message || error
                }\`\`\``,
                ephemeral: true,
            });
        }
    },
};
