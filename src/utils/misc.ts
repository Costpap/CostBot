import * as humanizeDuration from "humanize-duration";
import fetch from "node-fetch";
import { MessageEmbed, Client } from "discord.js";

/**
 * @param {string} text Text to clean
 * @example
 * import { clean } from "./utils/misc";
 *
 * const code: string = args.join(", ");
 * const evaled = await eval(code);
 *
 * console.log(clean(evaled));
 */
export const clean = (text: string) => {
	if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
	else {return text;}
};

/**
 * Automatically gets the latest release from [GitHub](https://github.com/Costpap/CostBot).
 * @param {string} tag_name The name of the tag of the latest release, for example: v0.0.0
 * @example
 * import { version } from "./utils/misc";
 *
 * console.log(version())
 */
export const version = async (): Promise<string> => {
	const { tag_name } = await fetch("https://api.github.com/repos/Costpap/CostBot/releases/latest").then(response => response.json());
	return tag_name as string;
};
/**
 *
 * @param embed discord.js messageEmbed
 * @param client discord.js client object
 * @param strings Strings required for field names
 * @param values Values required for embeds
 * @param options Options
 * @param {boolean} options.noInline Whether or not to inline the embed fields
 * @param {boolean} options.noUptimeInline Whether or not to inline the uptime field
 * @param {boolean} options.noUptime Whether or not to add an uptime field
 * @example
 * import * as Discord from "discord.js";
 * import { clientStats } from "./src/utils/misc";
 *
 * const embed = new Discord.MessageEmbed();
 * clientStats(embed, client);
 *
 * message.channel.send(embed);
 */
export async function clientStats(embed: MessageEmbed, client: Client, options?: ClientStatOptions): Promise<MessageEmbed> {
	const strings = {
		serverCount: 'Server Count',
		members: 'Total Members',
		uptime: 'Bot Uptime',
	};
	const values = {
		serverCount: client.guilds.cache.size,
		members: client.users.cache.size,
		uptime: humanizeDuration(client.uptime),
	};

	if (options?.noInline) {
		return embed.addFields(
			{ name: strings.serverCount, value: values.serverCount, inline: false },
			{ name: strings.members, value: values.members, inline: true },
			{ name: strings.uptime, value: values.uptime, inline: true },
		);
	}
	if (options?.noUptimeInline) {
		return embed.addFields(
			{ name: strings.serverCount, value: values.serverCount, inline: true },
			{ name: strings.members, value: values.members, inline: true },
			{ name: strings.uptime, value: values.uptime, inline: false },
		);
	}
	if (options?.noUptime) {
		return embed.addFields(
			{ name: strings.serverCount, value: values.serverCount, inline: true },
			{ name: strings.members, value: values.members, inline: true },
		);
	}
	return embed.addFields(
		{ name: strings.serverCount, value: values.serverCount, inline: true },
		{ name: strings.members, value: values.members, inline: true },
		{ name: strings.uptime, value: values.uptime, inline: true },
	);
}


export interface ClientStatOptions {
	noInline?: boolean;
	noUptimeInline?: boolean;
	noUptime?: boolean;
}