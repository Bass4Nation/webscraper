// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig-webscraper.json'
    }
  },
};
