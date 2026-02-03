module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/js', '<rootDir>/tests'],
  testMatch: ['**/*.test.js', '**/*.spec.js'],
  collectCoverageFrom: ['src/js/**/*.js'],
  passWithNoTests: true
};
