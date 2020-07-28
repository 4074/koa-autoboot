module.exports = {
  extends: [
    'uncley',
    'uncley/typescript' // Using if you using typescript.
  ],
  rules: {
    // Write custom rules here.
    'prettier/prettier': [
      'error',
      {
        // printWidth: 100,
        trailingComma: 'none',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        quoteProps: 'as-needed',
        jsxSingleQuote: false,
        arrowParens: 'always',
        endOfLine: 'auto'
      }
    ],
    '@typescript-eslint/camelcase': ['off', { properties: 'always' }],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false }
    ],
    'import/named': 'off' // Turn it off because it does not support `export * as ns` that is a new feature of es2020.
  }
}
