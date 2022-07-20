# CostBot

<div align="center">
<br role="presentation" />
<p>
<a href="https://github.com/Costpap/CostBot/actions"><img src="https://github.com/Costpap/CostBot/workflows/CostBot%20Continuous%20Integration/badge.svg" alt="CostBot CI"/></a>
</p>
</div>

This repository is home to all the code used by CostBot, an MIT-licensed Discord bot coded in [TypeScript](https://www.typescriptlang.org/) with the help of [discord.js](https://github.com/discordjs/discord.js).

## Requirements
- [Node.js](https://nodejs.org/) version 16 or newer (LTS release recommended)
- [npm](https://www.npmjs.com/) installed
- [Git](https://git-scm.com/) installed
- A Discord server for privileged commands

## Setup Instructions

1. First, you will need an application, which you can create in [Discord's Developer Portal](https://discord.com/developers/applications). Once it is created, add a bot to the application and click the "Reset Token" button to access its credentials, which you will need later.

2. Once everything is installed, open your terminal and paste the following command: `git clone https://github.com/Costpap/CostBot.git`. You'll now see a new directory called "CostBot" which contains all of the bot's source code. Run `cd CostBot`, then `npm install`. If you get a warning from npm regarding peer or optional dependencies, you can ignore it.

3. After all dependencies have been installed, you will need to setup the configuration files. Rename `.env.example` to `.env` and replace all the fields with appropriate values. Then go to the `/src` directory , rename `botconfig-example.ts` to `botconfig.ts` then replace all of the values as well.

4. You will now need to compile the [TypeScript](https://www.typescriptlang.org/) code, which can be done by running `npm run build`. If you get any build errors, please open an [issue](https://github.com/Costpap/CostBot/issues/new?assignees=Costpap&labels=bug&template=bug_report.md).

5. Before starting the bot, you need to register its commands with Discord by running `npm run commands set [guild id for privileged commands]`.

⚠️ **Note**: Some commands are dangerous. As such, they are considered as **privileged** and can only be used in a specific server of your choice. By default, only admins in that server will be able to use them, but this can be changed through **Server Settings → Integrations**. You can copy and paste the id of that server in the command above, without the brackets (eg. `npm run commands set 613425648685547541`).

6. You can now run `node .`to start up CostBot 🎉

## Important Documents

If you are planning to make contributions to the bot, please make yourself aware of the [Code of Conduct](.github/CODE_OF_CONDUCT.md) and [Contributing Guidelines](.github/CONTRIBUTING.md).
