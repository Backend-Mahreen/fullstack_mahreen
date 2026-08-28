// ESLint flat config untuk backend (CommonJS, Node.js).
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "package-lock.json",
      "swagger-output.json",
      "coverage/**",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {},
    rules: {
      ...js.configs.recommended.rules,
      // Node.js/CommonJS: require() dipakai secara global — default dari
      // eslint recommended tidak melarang ini, jadi aman.
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "error",
      eqeqeq: ["warn", "smart"],
      "no-console": "warn",
      "no-constant-condition": ["warn", { checkLoops: false }],
      "prefer-const": "warn",
      "no-prototype-builtins": "off",
    },
  },
];
