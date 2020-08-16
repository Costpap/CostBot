# CostBot
[![Dependencies](https://david-dm.org/costpap/costbot.svg)](https://david-dm.org/costpap/costbot)

This repository is home to all the code used by CostBot, a Discord Bot coded in [discord.js](https://github.com/discordjs/discord.js).

## Running the bot
Once you've installed all the dependencies by running `npm install`, rename `botconfig-example.ts` to `botconfig.ts` as well as `.env.example` to `.env` and replace all of the fields with their respective values. Before running the bot, the [TypeScript](https://typescriptlang.org) code first needs to be compiled, which can by done with `npm run build` (or `npx tsc`). Then, you can run `npm run start` and your bot should now be online.
