import type { InitialOptionsTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

export const config: InitialOptionsTsJest = {
  transform: {
    ...tsjPreset.transform,
  },
  testTimeout: 20000,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  modulePathIgnorePatterns: ['/dist/'],
  coveragePathIgnorePatterns: ['/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub',
    '~/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
