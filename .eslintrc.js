module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'class-methods-use-this': 0,
        'no-inline-comments': 'error',
        'no-var': 2,
        'semi-spacing': 2,
    },
};
