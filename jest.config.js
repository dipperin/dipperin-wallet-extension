module.exports = {
  collectCoverageFrom: ['<rootDir>/**/*.{js,jsx,ts,tsx}', '!<rootDir>/**/*.d.ts'],
  testMatch: ['<rootDir>/__tests__/**/*.(j|t)s?(x)', '<rootDir>/**/?(*.)(spec|test).(j|t)s?(x)'],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$'],
  moduleFileExtensions: ['web.ts', 'ts', 'web.tsx', 'tsx', 'web.js', 'js', 'web.jsx', 'jsx', 'json', 'node', 'mjs'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/../../tsconfig.test.json'
    }
  }
}
