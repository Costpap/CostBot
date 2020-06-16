module.exports = async (debug) => {
	if (process.env.DEBUG === 'true') {
		console.debug(debug);
	}
};