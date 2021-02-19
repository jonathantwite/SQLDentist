module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended',
        'plugin:vue-a11y/base'
    ],
    plugins: [
        'vue-a11y'
    ],
    // add your custom rules here
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        camelcase: ['error', {
            allow:
        ['store_getters', 'store_actions', 'store_mutations', 'post_logout_redirect_uri', 'response_type', 'redirect_uri', 'client_id']
        }],
        'comma-dangle': 'error',
        'comma-spacing': [
            'error',
            {
                before: false,
                after: true
            }
        ],
        'comma-style': ['error', 'last'],
        'func-call-spacing': ['error', 'never'],
        indent: ['error', 4],
        'vue/html-indent': ['error', 4],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-self-closing': 'off',
        'new-cap': [
            'error',
            {
                properties: false
            }
        ],
        'new-parens': 'error',
        'no-trailing-spaces': 'warn',
        'no-unused-expressions': 'error',
        'no-use-before-define': 'warn',
        'no-var': 'error',
        'object-curly-spacing': ['error', 'always'],
        'operator-linebreak': ['error', 'after', {
            overrides: {
                '?': 'before',
                ':': 'before',
                '&&': 'before',
                '||': 'before'
            }
        }],
        semi: ['error', 'always'],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        'space-infix-ops': 'error'
    }
};
