import Discord, { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { inspect } from 'util';
import { Context, runInNewContext, RunningScriptOptions } from 'vm';
import { parseCodeblock } from '../utils/misc';

export default {
    name: 'eval',
    description: 'Executes JavaScript code.',
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
        const code: string = parseCodeblock(interaction.options.getString('code', true));

        const options = {
            callback: false,
            stdout: true,
            stderr: true,
        };

        const context: Context = {
            client,
            interaction,
            Discord,
            console,
            require,
            process,
            global,
        };

        const scriptOptions: RunningScriptOptions = {
            filename: `${interaction.id}-${interaction.user.id}@${interaction.guildId}#${interaction.channelId}`,
            timeout: 60000,
            displayErrors: true,
        };

        let start: number = Date.now();
        let result = execute(`'use strict'; (async () => { ${code} })()`, context, scriptOptions);
        let end: number = Date.now();

        if (!(await result)?.stdout && !(await result)?.callbackOutput && !(await result)?.stderr) {
            start = Date.now();
            result = execute(`'use strict'; (async () => ${code} )()`, context, scriptOptions);
            end = Date.now();
        }

        result.then(async (res: Output) => {
            if (
                (options.stdout && res?.stdout) ||
                (options.stderr && res?.stderr) ||
                (options.callback && res?.callbackOutput)
            ) {
                console.log('Eval output - start:');
                if (options.callback && res.callbackOutput) console.log(res.callbackOutput);

                if (options.stdout && res.stdout) {
                    console.log('Eval stdout');
                    console.log(res.stdout);
                }
                if (options.stderr && res.stderr) {
                    console.log('Eval stderr');
                    console.log(res.stderr);
                }
                console.log('Eval output - end');
            }
            const embed: MessageEmbed = await generateEmbed(code, res, { start, end }, client);
            interaction.editReply({ embeds: [embed] });
        });
    },
};

async function execute(
    code: string,
    context: Context,
    options: unknown,
): Promise<{ stdout: string; stderr: string; callbackOutput?: unknown }> {
    return await new Promise((resolve) => {
        try {
            captureOutput(() => runInNewContext(code, context, options))
                .then(resolve)
                .catch(resolve);
        } catch (err) {
            resolve(err);
        }
    });
}

/**
 * Capture stdout and stderr while executing a function
 * @param {Function} callback The callback function to execute
 * @returns {Promise<CapturedOutput>} stdout, stderr and callback outputs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function captureOutput(callback: any): Promise<CapturedOutput> {
    return await new Promise((resolve, reject) => {
        const oldProcess = { ...process };
        let stdout = '';
        let stderr = '';

        // overwrite stdout write function
        process.stdout.write = (str: string) => {
            stdout += str;
            return true;
        };

        // overwrite stderr write function
        process.stderr.write = (str: string) => {
            stderr += str;
            return true;
        };

        try {
            const c = callback();

            delete process.stdout.write;
            process.stdout.write = oldProcess.stdout.write;

            delete process.stderr.write;
            process.stderr.write = oldProcess.stderr.write;

            return c
                .catch((c: Error) => reject({ stdout, stderr, callbackOutput: c }))
                .then((callbackOutput: unknown) => resolve({ stdout, stderr, callbackOutput }));
        } catch (error) {
            delete process.stdout.write;
            process.stdout.write = oldProcess.stdout.write;

            delete process.stderr.write;
            process.stderr.write = oldProcess.stderr.write;
            return reject({ stdout, stderr, callbackOutput: error });
        }
    });
}

async function generateEmbed(
    code: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outs: any,
    { start, end }: { start: number; end: number },
    client: Client,
): Promise<MessageEmbed> {
    const output = typeof outs?.callbackOutput?.then === 'function' ? await outs?.callbackOutput : outs?.callbackOutput;
    const stdout = outs?.stdout;
    const stderr = outs?.stderr;

    const embed: MessageEmbed = new MessageEmbed()
        .setFooter({
            text: `Execution time: ${end - start}ms`,
            iconURL: client.user.displayAvatarURL({ format: 'png' }),
        })
        .setTimestamp()
        .addField('📥 Input', '```js\n' + code.substring(0, 1015) + '```');

    if (output) {
        embed.addField(
            '📤 Output',
            '```js\n' +
                ((typeof output === 'string' ? output : inspect(output)) || 'undefined')?.substring(0, 1015) +
                '```',
        );
    }

    if (stdout)
        embed.addField(
            '🖥 stdout',
            '```js\n' +
                ((typeof stdout === 'string' ? stdout : inspect(stdout)) || 'undefined')?.substring(0, 1015) +
                '```',
        );

    if (stderr)
        embed.addField(
            '⚠ stderr',
            '```js\n' +
                ((typeof stderr === 'string' ? stderr : inspect(stderr)) || 'undefined')?.substring(0, 1015) +
                '```',
        );

    if ((stdout && !isError(outs?.callbackOutput)) || (stdout && !output) || (!stdout && !output && !stderr))
        embed.setTitle('Evaluation Successful');
    else if (!stdout && !output && stderr) embed.setTitle('Nothing was returned from execution');
    else embed.setTitle(isError(output) ? 'Evaluation Error' : 'Evaluation Successful');

    if ((stdout && !isError(outs?.callbackOutput)) || (stdout && !output) || (!stdout && !output && !stderr))
        embed.setColor('GREEN');
    else if (!stdout && !output && stderr) embed.setColor('YELLOW');
    else embed.setColor(isError(output) ? 'RED' : 'GREEN');

    return embed;
}

function isError(object: unknown): boolean {
    const name = object?.constructor?.name;
    if (!name) return true;
    return /.*Error$/.test(name);
}

interface Output {
    stdout: string;
    stderr: string;
    callbackOutput: unknown;
}
interface CapturedOutput {
    stdout: string;
    stderr: string;
    callbackOutput: unknown;
}
