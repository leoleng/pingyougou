module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-multiple-empty-lines': 0,
        'spaced-comment': 0,
        'return config': 0,
        'no-trailing-spaces': 0
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}