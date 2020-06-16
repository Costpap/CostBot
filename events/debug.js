module.exports = async (debug) => {
	if (process.env.NODE_ENV === 'development') {
		console.debug(debug);
	}
};