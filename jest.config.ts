import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    transform:{
        "^.+\\Child.[t|j]s?$": "workerloader-jest-transformer"
    },
    testEnvironment: 'node',
    forceExit: true,
    detectOpenHandles: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{ts,js}",
    ],
    coverageReporters: [
        "html",
        "lcov"
    ]
}

export default config;