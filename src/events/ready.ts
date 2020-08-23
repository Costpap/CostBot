import { corelogID } from "../botconfig";
import { Client, TextChannel } from 'discord.js';

export default async (Discord: typeof import('discord.js'), client: Client) => {
	const coreLog = client.channels.cache.get(corelogID) as TextChannel;
	coreLog.send(`🆗 Logged in with **${client.users.cache.size}** users across **${client.guilds.cache.size}** guilds!`);
	console.log(`Logged in as ${client.user.tag} (${client.user.id})!`);
};