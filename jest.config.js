module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  testEnvironment: "node",
  modulePathIgnorePatterns: [".*/__mocks__/.*\\.ts"],
};
