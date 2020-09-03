import { Message, Client, TextChannel, NewsChannel, MessageEmbed } from 'discord.js';
import { parseChannelMention } from '../utils/parse';

export default {
    name: 'say',
    description: 'Sends a message through the bot',
    aliases: ['send'],
    adminOnly: true,
    args: true,
    usage: '(#optional-channel) [text]',
    permissions: ['MANAGE_MESSAGES', 'EMBED_LINKS'],
    cooldown: 5,
    do: async (message: Message, client: Client, args: string[], Discord: typeof import('discord.js')) => {
        if (message.channel.type !== 'dm') message.delete();

        const sayChannel: TextChannel | NewsChannel = parseChannelMention(args[0], client);

        if (args[0] === 'embed' || args[1] === 'embed') {
            /**
             * Determines what number should be used in order to slice arguments.
             */
            let slicenumber: number;
            if (!sayChannel) slicenumber = 1;
            else slicenumber = 2;

            const embed = new Discord.MessageEmbed()
                .setColor('#6293f5')
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                .setDescription(args.slice(slicenumber).join(' '))
                .setTimestamp();

            return send(embed, sayChannel, message.channel as TextChannel | NewsChannel);
        }

        /**
         * Determines what number should be used in order to slice arguments.
         */
        let slicenumber: number;
        if (!sayChannel) slicenumber = 0;
        else slicenumber = 1;

        await send(args.slice(slicenumber).join(' '), sayChannel, message.channel as TextChannel | NewsChannel);
    },
};

/**
 * A function for sending say messages and handling errors as well as information regarding the messsage being sent.
 * @param input - What to send
 * @param sChannel - The channel where to send it (should be `sayChannel`)
 * @param messageChannel - The channel the `message` event was emitted in (should be `message.channel`)
 * @example
 * // This should work if you haven't modified any variable shown here.
 * const str: string = 'Hello, world!';
 * await send(str, sayChannel, message.channel);
 */
async function send(
    input: string | MessageEmbed,
    sChannel: TextChannel | NewsChannel,
    messageChannel: TextChannel | NewsChannel,
): Promise<Message> {
    /**
     * Determines what channel should be used in order to send the message.
     * @param sChannel - Should be `sayChannel`
     * @param messageChannel - The channel the `message` event was emitted in (`message.channel`)
     */
    const channel: TextChannel | NewsChannel = sChannel || messageChannel;
    await channel.send(input).catch((error) => {
        console.error(
            `Could not send message to #${channel.name} (${channel.id}) of guild ${channel.guild.id}:\n`,
            error,
        );
        if (!sChannel) return;
        return messageChannel.send(`❌ Could not send message to ${sChannel}.`);
    });
    if (!sChannel) return;
    /**
     * Message informing the user that their message has been sucessfully sent.
     * Deletes itself after 3 seconds.
     */
    const sentMessage: Message = await messageChannel.send(`✅ Sucessfully sent message to ${sChannel}!`);
    return sentMessage.delete({ timeout: 3000 });
}
