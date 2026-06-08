module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./test-setup.js'],
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js'],
  collectCoverageFrom: [
    'script.js'
  ],
  transform: {}
};