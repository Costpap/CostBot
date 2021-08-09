module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    env: {
        es2021: true,
        node: true,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    ignorePatterns: ['build/*'],
    rules: {
        'no-console': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-lonely-if': 'error',
        yoda: 'error',
    },
};
