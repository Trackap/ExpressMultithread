import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    transform:{
        "^.+\\Child.[t|j]s?$": "workerloader-jest-transformer"
    },
    testRegex: ".spec.[t|j]s",
    testEnvironment: 'node',
    forceExit: true,
    detectOpenHandles: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/test/",
        "/dist/"
    ],
    coverageReporters: [
        "html",
        "lcov"
    ]
}

export default config;