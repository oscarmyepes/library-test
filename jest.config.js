module.exports = {
  verbose: true,
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/setUpTest.ts'],
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'json', 'text'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/*.stories.{ts,tsx}',
    '!**/index.{ts,tsx}',
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
};
