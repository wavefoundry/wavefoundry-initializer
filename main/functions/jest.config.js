module.exports = {
    preset: 'ts-jest',
    testPathIgnorePatterns: [
        "<rootDir>/lib",
        "<rootDir>/src/__tests__/test_constants"
    ],
    testEnvironment: 'node'
};