module.exports = {
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!(uuid)/)",
  ],
  transform: {
    "^.+\\.jsx?$": ["babel-jest", { presets: [["@babel/preset-env", { targets: { node: "current" } }]] }],
  },
};
