# CostBot

<div align="center">
<br role="presentation" />
<p>
<a href="https://github.com/Costpap/CostBot/actions"><img src="https://github.com/Costpap/CostBot/workflows/CostBot%20Continuous%20Integration/badge.svg" alt="CostBot CI"/></a>
<a href="https://david-dm.org/Costpap/CostBot"><img src="https://img.shields.io/david/Costpap/CostBot.svg" alt="Dependencies" /></a>
</p>
</div>

This repository is home to all the code used by CostBot, a Discord Bot coded in [TypeScript](https://www.typescriptlang.org/) with the help of [discord.js](https://github.com/discordjs/discord.js).

## Detailed instructions on how to run the bot

### Discord-related set-up

First and foremost, you will need a [Discord Developer Application](https://discord.com/developers/applications). You can create a new one or use an existing if you wish. You will need to have a bot account for the application. Save the token for later, as it will be needed during configuration.

### The rest of the set-up

1. First of all, you should have at least version 12 of [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. You can download them from [here](https://nodejs.org/en/download/). We recommend using the latest Long Term Support (LTS) release.
   However, if you want to use a version earlier than 12, that is entirely possible. Before following _step 6_ later on, you can edit `tsconfig.json` and change the `target` to the ECMAScript version corresponding to the Node one you want to use.

2. Once Node and npm has finished installing, you should also install [Git](https://git-scm.com/), as it is needed in order to clone the repository. You can download it from [here](https://git-scm.com/downloads).

3. After having finished installing Git, open your terminal, command line, prompt, etc. and copy and paste the following command: `git clone https://github.com/Costpap/CostBot.git`.

4. Once that has finished, you should now see a new directory called `CostBot` which contains all of the bot's source code. Run `cd CostBot` and then `npm install`.

5. When all dependencies have been installed (if you get any warnings from npm regarding peer or optional dependencies, you can simply ignore them), you will then need to set up the configuration files. Rename `.env.example` to `.env` and replace all the fields with their appropriate values. After that, you can go to the `src` directory and rename `botconfig-example.ts` to `botconfig.ts` and replace all of the values as well.

6. Now, the only remaining step is to compile all of the [TypeScript](https://www.typescriptlang.org/) code, which can be done very easily with `npm run build`. If you get any errors, don't worry, you can _optionally_ delete the `build` directory if one exists and then run `npx tsc`. You should now see a `build` directory. If that still hasn't fixed your inquiry, please open an [issue](https://github.com/Costpap/CostBot/issues/new/choose).

7. Finally, you can run `node .` or `node ./build/index.js`, and your bot should now be online. Congratulations!

## Important Documents

Please make sure to read all of the documents below, especially if you are planning on making contributions such as opening a Pull Request or Issue.

-   [Code of Conduct (CoC)](.github/CODE_OF_CONDUCT.md)
-   [Contributing Guidelines](.github/CONTRIBUTING.md)
