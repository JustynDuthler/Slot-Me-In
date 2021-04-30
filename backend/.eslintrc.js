module.exports = {
  "root": true,
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'rules': {
    "linebreak-style": ["error", (require("os").EOL === "\r\n" ? "windows" : "unix")],
  },
  "ignorePatterns": [
    "*.test.js", ".eslintrc.js",
  ],
};
