module.exports = {
    "env": {
        "node": true,
        "mocha": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2015
    },
    "parser": "babel-eslint",
    "rules": {
        "no-console":["error",{
            "allow":["warn","error","info"]
        }],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }};