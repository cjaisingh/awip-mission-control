module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        'react',
        'react-hooks',
        'jsx-a11y'
    ],
    rules: {
        'no-unused-vars': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-undef': 'warn',
        'react/prop-types': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'jsx-a11y/anchor-is-valid': 'warn',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error'
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    globals: {
        'Chart': 'readonly',
        'd3': 'readonly',
        'Sortable': 'readonly'
    }
};
