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
  "settings": {
    "react": {
      "version": "detect", 
    },
  },
  "ignorePatterns": [ 
    "*.test.js", ".eslintrc.js",
  ],
};
