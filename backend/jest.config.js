module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/controllers/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true
};