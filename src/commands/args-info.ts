export default {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	args: true,
	usage: 'argument(s)',
	cooldown: 5,
	execute({ message, args }: { message: any; args: any; }) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}
		if (args[0] === 'eri') {
			return message.channel.send('eri');
		}
		if (args[0] === 'Dom') {
			return message.channel.send('dommy');
		}
		if (args[0] === 'suspense') {
			return message.channel.send('spense');
		}
		if (args[0] === 'Costpap') {
			return message.channel.send('God');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};