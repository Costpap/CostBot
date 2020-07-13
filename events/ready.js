module.exports = async (Discord, client) => {
	const coreLog = await client.channels.cache.get(process.env.CORELOG_ID);
	coreLog.send(`🆗 Logged in with **${client.users.cache.size}** users across **${client.guilds.cache.size}** guilds!`);
	console.log(`Logged in as ${client.user.tag} (${client.user.id})!`);
};