# CostBot Contributing Guidelines

## Setup

You can follow the [instructions in the README](https://github.com/Costpap/CostBot/blob/master/README.md#detailed-instructions-on-how-to-run-the-bot) in order to get your development environment ready. However, please do note that you should make a fork of the repository first, and then clone that instead of this repository.

## What to remember when contributing

With that out of the way, you can now make as many changes to the codebase as you wish! Please make sure to run `npx eslint .` and `npm run build` (or removing the `build` directory and running `npx tsc` after each change in order to make sure that there are no style or compiler errors. While there is a [GitHub Actions](https://github.com/Costpap/CostBot/actions/) workflow to ensure that there are no style or compiler errors, it's better to be safe than sorry. In addition to that, it is much more time-efficient and easier to fix problems as they appear, instead of having to do so after finishing and submitting a pull request. It is also highly recommended that you check any changes you make in Discord, as GitHub Actions is not perfect and errors can still manage to appear. If you have made changes to a command, be sure to run that command in order to be certain it works. If you have made changes to an event, you can use the `eval` command and run `client.emit('event name', User/GuildMember etc)` in order to make sure that the event actually works.

### Code style

Code style is automatically enforced by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). As mentioned above, you can run `npx eslint .` in a terminal or command prompt in order to make sure that everything is fine. If it gives you some errors, most of the time they can easily be fixed wih `npx eslint . --fix`. In conjunction with that, please also run `npx tsc` in order to make sure that there are no compiler errors. If there are, your IDE will most likely have a tooltip of some sorts to help you fix it.

### Typings

Please try your best to statically type everything and avoid using `any`. If you're unsure on how to cast a type, you can use `unknown` or `never`, with the former usually being the preferred choice. If you need to declare a type, interface, enum or such, please add it to the [index.d.ts](https://github.com/Costpap/CostBot/blob/master/src/typings/index.d.ts) file and `export` it. However, for things in the `utils` folder, it's fine to have the type definitions in the same file.

### Commenting

Please try to use [JSDoc](https://jsdoc.app/index.html) comments for readability. Casting types in JSDoc comments is not necessarily required, however, it can be useful for IDE tooltips and such. If you choose to cast one, be sure to cast it with TypeScript as well.

## Finally

At last, once you have finished making your changes and ensured that they are properly working, you can:

1. Run `git add <files you have changed>`
2. Afterwards, run `git commit --allow-empty-message -m "commit message"`, with the commit message preferably following 
[the Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/)
3. Once you have made a commit, run `git push origin`
4. Open a Pull Request on GitHub. Tada!