module.exports = async client => {
	client.user.setActivity('Costpap shout', { type: 'LISTENING' });
	console.log(`Logged in as ${client.user.tag}!`);
};