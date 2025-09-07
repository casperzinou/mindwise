// jest.config.js
module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx): ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleNameMapper: {
    '^@/components/(.*): '<rootDir>/components/$1',
    '^@/lib/(.*): '<rootDir>/lib/$1',
    '^@/app/(.*): '<rootDir>/app/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  // Add this to handle React 19
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|react|react-dom)/)',
  ],
  // Add this to handle modern JSX transform
  globals: {
    'ts-jest': {
      babelConfig: {
        presets: [
          ['next/babel', { 'preset-react': { runtime: 'automatic' } }],
        ],
      },
    },
  },
}