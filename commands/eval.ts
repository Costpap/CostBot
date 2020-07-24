import { Message, Client } from 'discord.js';

export default {
	name: 'eval',
	description: 'Runs JavaScript code.',
	ownerOnly: true,
	usage: 'code',
	args: true,
	permissions: ['EMBED_LINKS'],
	do: async (message: Message, client: Client, args: string[], Discord: typeof import ('discord.js')) => {
		const clean = text => {
			if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
			else {return text;}
		};
		const before: number = Date.now();
		const code: string = args.join(' ');
		try {
			let evaled = await eval(code);

			if (typeof evaled !== 'string') {evaled = (await import('util')).inspect(evaled);}

			if (evaled.length > 1016) {
				console.log('Eval Output:\n', clean(evaled));
				evaled = '"The output cannot be displayed as it is longer than 1024 characters. Please check the console."';
			}


			const embed = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setTitle('Evaluation Successful')
				.addFields(
					{ name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
					{ name: '📤 Output', value: `\`\`\`js\n${clean(evaled)}\`\`\`` },
				)
				.setTimestamp()
				.setFooter(`Execution time: ${Math.round(Date.now() - before)}ms`, client.user.displayAvatarURL({ format: 'png' }));

			message.channel.send(embed);
		}
		catch (error) {
			console.error('Eval:', error);
			const embed = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('Evaluation Error')
				.addFields(
					{ name: '📥 Input', value: `\`\`\`js\n${code}\`\`\`` },
					{ name: '❌ Error message', value: `\`\`\`js\n${error.message}\`\`\`` },
				)
				.setTimestamp()
				.setFooter(`Execution time: ${Math.round(Date.now() - before)}ms`, client.user.displayAvatarURL({ format: 'png' }));
			message.channel.send(embed);
		}
	},
};