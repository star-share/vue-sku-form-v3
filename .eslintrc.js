module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module'
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off',
        'no-unused-vars': 'warn'
    }
};
