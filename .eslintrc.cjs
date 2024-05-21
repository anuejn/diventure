module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": ["**/*.{js,ts}"],
            "parserOptions": {
                "sourceType": "script",
                "project": "./tsconfig.json",
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "no-constant-condition": "off",
        "@typescript-eslint/no-floating-promises": ["warn", {ignoreIIFE: true}],
    }
}
