module.exports = {
  "root": true,
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
    "plugin:react/recommended",
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true,
      "spread" : true,
      "restParams" : true,
    },
  },
  'rules': {
    "linebreak-style": ["error", "windows"],
    "require-jsdoc": ["error", {
        "require": {
            "FunctionDeclaration": false,
            "MethodDefinition": false,
            "ClassDeclaration": false,
            "ArrowFunctionExpression": false,
            "FunctionExpression": false
        }
    }]
  },
  "settings": {
    "react": {
      "version": "detect",
    },
  },
  "ignorePatterns": [
    "*.test.js", ".eslintrc.js", "*.js",
  ],
};
