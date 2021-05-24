const React = require('react');
const renderer = require('react-test-renderer');
const testing = require('@testing-library/react');
const cleanup = testing.cleanup;

test('adds 1 + 2 to equal 3', () => {
  expect((()=>(1+2))()).toBe(3);
});
