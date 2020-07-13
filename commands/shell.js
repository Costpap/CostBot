const exec = (require('util').promisify((require('child_process').exec)));

module.exports = {
	name: 'shell',
	description: 'Runs Shell code.',
	ownerOnly: true,
	usage: 'code',
	args: true,
	permissions: ['EMBED_LINKS'],
	do: async (message, client, args, Discord) => {
		const clean = text => {
			if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
			else {return text;}
		};
		const before = Date.now();
		const code = args.join(' ');
		try {
			/* eslint-disable-next-line prefer-const */
			let { stdout, executed } = await exec(code);

			if (typeof executed !== 'string') {executed = require('util').inspect(executed);}

			const embed = new Discord.MessageEmbed()
				.setColor('GREEN')
				.setTitle('Execution Successful')
				.addField('📥 Input', `\`\`\`bash\n${code}\`\`\``)
				.setTimestamp()
				.setFooter(`Execution time: ${Math.round(Date.now() - before)}ms`, client.user.displayAvatarURL({ format: 'png' }));
			if (stdout) {
				embed.addField('🖥 stdout', `\`\`\`bash\n${clean(stdout)}\`\`\``);
			}
			message.channel.send(embed);
		}
		catch (error) {
			console.error('Shell:', error);
			const embed = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('Execution Error')
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