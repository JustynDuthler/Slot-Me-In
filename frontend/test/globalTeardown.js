/*
 * Stops the dev server after tests finish
 */
const {teardown: teardownDevServer} = require('jest-dev-server');

module.exports = async () => {
  await teardownDevServer();
};
