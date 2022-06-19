import fetch from 'node-fetch';
import { readFileSync } from 'fs';

/**
 * Gets the commit hash of the commit HEAD is currently pointed to.
 * @returns {string} - The commit hash of the commit HEAD is currently pointed to.
 */
const getCommitHash = (): string => {
    const rev = readFileSync('.git/HEAD')
        .toString()
        .trim()
        .split(/.*[: ]/)
        .slice(-1)[0];
    if (rev.indexOf('/') === -1) {
        return rev;
    } else {
        return readFileSync('.git/' + rev)
            .toString()
            .trim();
    }
};

/**
 * Gets the CI run number of the commit HEAD is pointed to, or if it cannot do that, the commit hash of that commit.
 * @returns {string} - The CI run number corresponding to the commit HEAD is pointed to,
 * or the first 7 characters of the commit hash if that the CI run number cannot be found.
 */
export const getBuildNumber = async (): Promise<string> => {
    const { workflow_runs } = await fetch(
        'https://api.github.com/repos/Costpap/CostBot/actions/workflows/2229894/runs',
    ).then((response) => response.json());
    try {
        const run = await workflow_runs.find((r) => r.head_sha === getCommitHash());
        return run.run_number as string;
    } catch (err) {
        console.error(`Could not get build number: ${err}`);
        return (await getCommitHash()).substring(0, 7);
    }
};

/**
 * Returns the version the bot is running, based on the Git commit HEAD is pointed to.
 * @returns A string with this format: 'v2-(CI Run number or short Git commit hash)
 */
export const version = async (): Promise<string> => {
    const buildNumber = await getBuildNumber();
    return `v2-${buildNumber}`;
};
