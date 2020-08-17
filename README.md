# CostBot
<div align="center">
<br role="presentation" />
<p>
<a href="https://github.com/Costpap/CostBot/actions"><img src="https://github.com/Costpap/CostBot/workflows/CostBot%20Continuous%20Integration/badge.svg" alt="CostBot CI"/></a>
<a href="https://david-dm.org/Costpap/CostBot"><img src="https://img.shields.io/david/Costpap/CostBot.svg" alt="Dependencies" /></a>
</p>
</div>

This repository is home to all the code used by CostBot, a Discord Bot coded in [discord.js](https://github.com/discordjs/discord.js).

## Running the bot
Once you've installed all the dependencies by running `npm install`, rename `botconfig-example.ts` to `botconfig.ts` as well as `.env.example` to `.env` and replace all of the fields with their respective values. Before running the bot, the [TypeScript](https://typescriptlang.org) code first needs to be compiled, which can by done with `npm run build` (or `npx tsc`). Then, you can run `npm run start` and your bot should now be online.
