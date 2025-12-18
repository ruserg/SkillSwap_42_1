const { resolve } = require("path");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  rootDir: process.cwd(),

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$":
      "<rootDir>/__mocks__/fileMock.js",

    // Моки для API
    "^@shared/api/api$": "<rootDir>/__mocks__/api.ts",
    "^@shared/api/mockApi$": "<rootDir>/__mocks__/mockApi.ts",

    // Алиасы путей
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@images/(.*)$": "<rootDir>/src/shared/assets/images/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@widgets/(.*)$": "<rootDir>/src/widgets/$1",
  },

  testMatch: [
    "<rootDir>/src/**/*.test.{ts,tsx}",
    "<rootDir>/src/**/*.spec.{ts,tsx}",
  ],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
        useESM: false,
        babelConfig: false,
      },
    ],
  },

  transformIgnorePatterns: ["/node_modules/(?!react-router|react-router-dom)/"],

  moduleDirectories: ["node_modules", "src", "__mocks__"],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/",
    "/.vite/",
    "/.git/",
  ],

  collectCoverage: false,
  verbose: true,
};
