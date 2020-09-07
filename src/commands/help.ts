import { prefix } from '../botconfig';
import { version } from '../utils/misc';
import type { Command } from '../typings/index';
import { Message, Client } from 'discord.js';

export default {
    name: 'help',
    description: 'Lists all of my commands or info about a specific command.',
    aliases: ['commands', 'cmds'],
    usage: '[command name]',
    permissions: ['EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
        if (!args.length) {
            const embed = new Discord.MessageEmbed()
                .setColor('#6293f5')
                .setAuthor(`${client.user.username} Help`, client.user.displayAvatarURL({ format: 'png' }))
                .setTitle("Here's a list of all my commands:")
                .setDescription(client.commands.map((command) => command.name).join(', '))
                .setTimestamp()
                .setFooter(`You can send "${prefix}help [command name]" to get info on a specific command!`);

            try {
                await message.author.send(embed);
                if (message.channel.type === 'dm') return;
                return message.channel.send('✅ I have sent you a DM with all my commands!');
            } catch (error) {
                console.error(`Could not send help DM to ${message.author.tag} (${message.author.id}):\n`, error);
                return message.channel.send("❌ I can't DM you. **Please make sure that you have DMs enabled.**");
            }
        }

        const name: string = args[0].toLowerCase();
        const command: Command =
            client.commands.get(name) || client.commands.find((cmd) => cmd.aliases?.includes(name));

        if (!command) {
            return message.channel.send(
                `❌ That's not a valid command. Do \`${prefix}help\` to see a list of all commands.`,
            );
        }

        try {
            const embed = new Discord.MessageEmbed();
            embed.setColor('#6293f5');
            embed.setTitle(`**Command Name:** ${command.name}`);
            if (command.disabled) {
                embed.setDescription('⚠ This command is currently **disabled**.');
            }
            if (command.aliases) {
                embed.addField(command.aliases.length > 1 ? 'Aliases' : 'Alias', command.aliases.join(', '));
            }
            if (command.description) {
                embed.addField('Description', command.description);
            }
            if (command.ownerOnly) {
                embed.addField('Permission level', 'Bot Owner');
            }
            if (command.adminOnly) {
                embed.addField('Permission level', 'Bot Administrator');
            }
            if (command.usage) {
                embed.addField('Usage', `${prefix}${command.name} ${command.usage}`);
            }
            embed.addField('Cooldown', `${command.cooldown ?? 3} ${command.cooldown === 1 ? 'second' : 'seconds'}`);
            embed.setTimestamp();
            embed.setFooter(
                `${client.user.username} ${await version()}`,
                client.user.displayAvatarURL({ format: 'png' }),
            );
            message.channel.send(embed);
        } catch (error) {
            console.error(`Error trying to get info on ${command.name}:\n`, error);
            message.channel.send(
                `❌ I encountered an error trying to get information on this command. \`\`\`js\n${error.message}\`\`\``,
            );
        }
    },
};
