module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'no-undef': 'error'
    },
    globals: {
        'Chart': 'readonly',
        'd3': 'readonly',
        'Sortable': 'readonly'
    }
};
