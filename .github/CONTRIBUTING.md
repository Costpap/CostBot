# CostBot Contributing Guidelines

## Setup

You can follow the [instructions in the README](../README.md#detailed-instructions-on-how-to-run-the-bot) in order to get your development environment ready. However, please do note that you should make a fork of the repository first, and then clone that instead of this repository.

Note: If you have [GitHub CLI](https://cli.github.com) installed, you can simply run `gh repo fork Costpap/CostBot` and press `y` when asked if to clone, instead of making a fork on [github.com](https://github.com) and then using Git to clone it.

## What to remember when contributing

With that out of the way, you can now make as many changes to the codebase as you wish! Please make sure to run `npx eslint .` and `npm run build` (or removing the `build` directory and running `npx tsc` after each change) in order to make sure that there are no style or compiler errors.

Moreover, any changes made to the bot itself and any of its commands or events should be tested thoroughly in Discord using a bot. Unlike code style and compiler errors, Continuous Integration **cannot** know if an interaction is going to resolve successfully or not.

For your convenience, if you make any changes to events, you can test them using the `/eval` command and running `client.emit('eventName', User/GuildMember/etc)`

### Code style & TS compiler errors

Code style is automatically enforced by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). As mentioned above, you can run `npx eslint .` in a terminal or command prompt in order to make sure that everything is fine. If it gives you some errors, most of the time they can easily be fixed wih `npx eslint . --fix`.

As this project is written in TypeScript, the TypeScript compiler is used in order to transpile the project and make it readable by Node.js. The TypeScript compiler can be ran using `npx tsc`. If it gives you errors, chances are your IDE will have a tooltip of some sorts to help you fix them.

### Typings

Please try your best to statically type everything and avoid using `any`. If you're unsure on how to cast a type, you can use `unknown` or `never`, with the former usually being the preferred choice. If you need to declare a type, interface, enum or such, please add it to the [index.d.ts](../src/typings/index.d.ts) file and `export` it. However, for things in the `utils` folder, it's fine to have the type definitions in the same file.

### Commenting

Please try to use [JSDoc](https://jsdoc.app/index.html) comments for readability. Casting types in JSDoc comments is not necessarily required, however, it can be useful for IDE tooltips and such. If you choose to cast one, be sure to cast it with TypeScript as well.

## Finally

At last, once you have finished making your changes and ensured that they are properly working, you can:

1. Run `git add <files you have changed>`
2. Afterwards, run `git commit --allow-empty-message -m "commit message"`, with the commit message preferably following
   [the Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/)
3. Once you have made a commit, run `git push origin`
4. Open a Pull Request on GitHub. Tada!
