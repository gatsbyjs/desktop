const TSEslint = require(`@typescript-eslint/eslint-plugin`)

module.exports = {
  parser: `babel-eslint`,
  extends: [
    `google`,
    `eslint:recommended`,
    `plugin:react/recommended`,
    `prettier`,
    `prettier/react`,
  ],
  plugins: [`prettier`, `react`, `filenames`],
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: `module`,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    before: true,
    after: true,
    spyOn: true,
    __PATH_PREFIX__: true,
    __BASE_PATH__: true,
    __ASSET_PREFIX__: true,
  },
  rules: {
    "arrow-body-style": [
      `error`,
      `as-needed`,
      { requireReturnForObjectLiteral: true },
    ],
    "no-unused-expressions": [
      `error`,
      {
        allowTaggedTemplates: true,
      },
    ],
    "consistent-return": [`error`],
    "filenames/match-regex": [`error`, `^[a-z-\\d\\.]+$`, true],
    "no-console": `off`,
    "no-inner-declarations": `off`,
    "prettier/prettier": `error`,
    quotes: [`error`, `backtick`],
    "react/display-name": `off`,
    "react/jsx-key": `warn`,
    "react/no-unescaped-entities": `off`,
    "react/prop-types": `off`,
    "require-jsdoc": `off`,
    "valid-jsdoc": `off`,
  },
  overrides: [
    {
      files: [`*.ts`, `*.tsx`],
      parser: `@typescript-eslint/parser`,
      plugins: [`@typescript-eslint/eslint-plugin`],
      rules: {
        ...TSEslint.configs.recommended.rules,
        // We should absolutely avoid using ts-ignore, but it's not always possible.
        // particular when a dependencies types are incorrect.
        "@typescript-eslint/ban-ts-comment": `warn`,
        // This rule is great. It helps us not throw on types for areas that are
        // easily inferrable. However we have a desire to have all function inputs
        // and outputs declaratively typed. So this let's us ignore the parameters
        // inferrable lint.
        "@typescript-eslint/no-inferrable-types": [
          `error`,
          { ignoreParameters: true },
        ],
        // This rule tries to ensure we use camelCase for all variables, properties
        // functions, etc. However, it is not always possible to ensure properties
        // are camelCase. Specifically we have `node.__gatsby_resolve` which breaks
        // this rule. This allows properties to be whatever they need to be.
        "@typescript-eslint/naming-convention": [
          `error`,
          {
            selector: `default`,
            format: [`camelCase`],
          },
          {
            selector: `variable`,
            format: [`camelCase`, `UPPER_CASE`],
          },
          {
            selector: `function`,
            format: [`camelCase`, `PascalCase`],
          },
          {
            selector: `memberLike`,
            modifiers: [`private`],
            format: [`camelCase`],
            leadingUnderscore: `require`,
          },

          {
            selector: `typeLike`,
            format: [`PascalCase`],
          },
          {
            selector: `interface`,
            format: [`PascalCase`],
            prefix: [`I`],
          },
        ],
        // This rule tries to prevent using `require()`. However in node code,
        // there are times where this makes sense. And it specifically is causing
        // problems in our tests where we often want this functionality for module
        // mocking. At this point it's easier to have it off and just encourage
        // using top-level imports via code reviews.
        "@typescript-eslint/no-var-requires": `off`,
        // This rule ensures that typescript types do not have semicolons
        // at the end of their lines, since our prettier setup is to have no semicolons
        // e.g.,
        // interface Foo {
        // -  baz: string;
        // +  baz: string
        // }
        "@typescript-eslint/member-delimiter-style": [
          `error`,
          {
            multiline: {
              delimiter: `none`,
            },
          },
        ],

        "@typescript-eslint/no-empty-function": `off`,
        // This ensures that we always type the return type of functions
        // a high level focus of our TS setup is typing fn inputs and outputs.
        "@typescript-eslint/explicit-function-return-type": `error`,
        // This forces us to use interfaces over types aliases for object definitions.
        // Type is still useful for opaque types
        // e.g.,
        // type UUID = string
        "@typescript-eslint/consistent-type-definitions": [
          `error`,
          `interface`,
        ],
        "@typescript-eslint/no-use-before-define": [
          `error`,
          { functions: false },
        ],
        // Allows us to write unions like `type Foo = "baz" | "bar"`
        // otherwise eslint will want to switch the strings to backticks,
        // which then crashes the ts compiler
        quotes: `off`,
        "@typescript-eslint/quotes": [
          2,
          `backtick`,
          {
            avoidEscape: true,
          },
        ],
      },
    },
  ],
  settings: {
    react: {
      version: `16.4.2`,
    },
  },
}
