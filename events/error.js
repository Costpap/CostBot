module.exports = async (client, error) => {
	const errorLog = await client.channels.cache.get(process.env.ERRORLOG_ID);
	let err = error;
	if (err.length > 1992) {
		err = '"An error was caught, but it can\'t be displayed due to it being over 2000 characters."';
		err += `\n\n"Below you can find the error message: \n${error.message}`;
	}
	errorLog.send(err, { code: 'js ' });
	console.error(error);
};