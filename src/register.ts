import { config } from 'dotenv';
config({ path: './.env' });

import { REST } from '@discordjs/rest';
import { APIApplicationCommand, Routes } from 'discord.js';
import { readdirSync } from 'fs';

if (!process.env.TOKEN) {
    console.error('Missing client token. Shutting down...');
    process.exit(1);
}
const clientId = Buffer.from(process.env.TOKEN.split('.')[0], 'base64').toString();

const args = process.argv.slice(2);
const mode = args[0].toLowerCase();
const guildId = args[1] || undefined;

if (!['set', 'delete'].includes(mode)) {
    console.error("Mode must be either 'set' or 'delete'. Shutting down...");
    process.exit(1);
}

if (!guildId.match(/^[0-9]{17,20}$/)) {
    console.error('Invalid guild ID specified. Shutting down...');
    process.exit(1);
}

if (mode === 'delete') {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    (async () => {
        try {
            console.log('Deleting all privileged commands...');
            await ((await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: [],
            })) as Promise<APIApplicationCommand[]>);

            console.log(`Successfully deleted all privileged commands!`);
        } catch (error) {
            console.error('Encountered error while deleting privileged commands:', error);
        }

        try {
            console.log('Deleting global commands...');
            await ((await rest.put(Routes.applicationCommands(clientId), {
                body: [],
            })) as Promise<APIApplicationCommand[]>);

            console.log(`Successfully deleted all global commands!`);
        } catch (error) {
            console.error('Encountered error while deleting global commands:', error);
        }
    })();
} else if (mode === 'set') {
    (async () => {
        const globalCommands = [];
        const privilegedCommands = [];
        const commandFiles: string[] = readdirSync('./build/commands').filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            await import(`./commands/${file}`).then(({ default: command }) => {
                if (command?.internals?.privileged) {
                    privilegedCommands.push(command.data.toJSON());
                } else {
                    globalCommands.push(command.data.toJSON());
                }
            });
        }

        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        try {
            console.log('Registering privileged commands...');
            const createdPrivilegedCommands = await ((await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                {
                    body: privilegedCommands,
                },
            )) as Promise<APIApplicationCommand[]>);

            console.log(`Successfully registered all ${createdPrivilegedCommands.length} privileged commands!`);
            console.table(
                createdPrivilegedCommands.map((cmd) => ({
                    name: cmd.name,
                    id: cmd.id,
                    type: cmd.type,
                    guildId: cmd.guild_id,
                })),
            );
        } catch (error) {
            console.error('Encountered error while registering privileged commands:', error);
        }

        try {
            console.log('Registering global commands...');
            const createdGlobalCommands = await ((await rest.put(Routes.applicationCommands(clientId), {
                body: globalCommands,
            })) as Promise<APIApplicationCommand[]>);

            console.log(`Successfully registered all ${createdGlobalCommands.length} global commands!`);
            console.table(
                createdGlobalCommands.map((cmd) => ({
                    name: cmd.name,
                    id: cmd.id,
                    type: cmd.type,
                    dmPermission: cmd.dm_permission,
                })),
            );
        } catch (error) {
            console.error('Encountered error while registering global commands:', error);
        }
    })();
}
