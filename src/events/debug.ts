export default async (debug: string) => {
	if (!process.env.DEBUG || process.env.DEBUG !== 'true') return;
	console.debug(debug);
};