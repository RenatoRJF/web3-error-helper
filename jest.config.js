module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Snapshot configuration to handle dynamic content better
  snapshotSerializers: [],
  // Better snapshot handling
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: false,
  },
  // Remove forced snapshot updates
  // updateSnapshot: process.env.UPDATE_SNAPSHOTS === 'true',
  // Verbose output for debugging
  verbose: false,
  // Clear mocks between tests
  clearMocks: true,
  // Reset modules between tests
  resetMocks: true,
  // Restore mocks between tests
  restoreMocks: true,
};
