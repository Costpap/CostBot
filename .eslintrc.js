module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        node: true,
        es6: true,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
    ignorePatterns: ['build/*'],
    rules: {
        'no-console': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-lonely-if': 'error',
        yoda: 'error',
    },
};
