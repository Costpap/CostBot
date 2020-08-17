/**
 * @param {string} text Text to clean
 * @example
 * import { clean } from "./utils/misc";
 *
 * const code: string = args.join(", ");
 * const evaled = await eval(code);
 *
 * console.log(clean(evaled));
 */
export const clean = (text: string) => {
	if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
	else {return text;}
};