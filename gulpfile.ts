import { TestRunner, TestSet } from 'alsatian';
import del from 'del';
import GulpClient from 'gulp';
import GulpIstanbul from 'gulp-istanbul';
import tslintPlugin from 'gulp-tslint';
import * as gulpTypescript from 'gulp-typescript';
import merge from 'merge-stream';
import streamToPromise from 'stream-to-promise';
import { TapBark } from 'tap-bark';
import * as TSlint from 'tslint';

enum TestOutput {
    None,
    Result,
    Coverage
}

const tsProject = gulpTypescript.createProject('./src/tsconfig.json');
const tsLintProgram = TSlint.Linter.createProgram('./src/tsconfig.json');

const declarationFiles = './src/**/*.d.ts';
const buildDirectiory = './build/';

const coverableFiles = ['./build/**/*.js', '!./build/**/*.spec.*', '!./build/**/index.js'];
const testFiles = './build/**/*.spec.js';
const debugTestFiles = './src/**/*.spec.ts';

const coverageDirectiory = './coverage/';

const distributeFiles = ['./build/**/*.*', '!./build/**/*.spec.*'];
const distributeDirectiory = './dist/';

async function runAlsatian(output: TestOutput) {
    const testRunner = new TestRunner();

    switch (output) {
        case TestOutput.Result:
            testRunner.outputStream.pipe(TapBark.create().getPipeable()).pipe(process.stdout);
            break;

        case TestOutput.Coverage:
            await streamToPromise(
                GulpClient
                    .src(coverableFiles)
                    .pipe(GulpIstanbul({ includeUntested: true }))
                    .pipe(GulpIstanbul.hookRequire())
            );
            testRunner.outputStream.pipe(GulpIstanbul.writeReports({ dir: './coverage' }));
            break;

        default:
    }

    const testSet = TestSet.create();

    testSet.addTestsFromFiles(testFiles);

    return testRunner.run(testSet);
}

function typescriptBuild() {
    return merge(
        tsProject
            .src()
            .pipe(tsProject())
            .pipe(GulpClient.dest(buildDirectiory)),
        GulpClient.src(declarationFiles).pipe(GulpClient.dest(buildDirectiory))
    );
}

function typescriptLint() {
    return tsProject
        .src()
        .pipe(
            tslintPlugin({
                fix: true,
                formatter: 'stylish',
                program: tsLintProgram
            })
        )
        .pipe(tslintPlugin.report());
}

async function typescriptTestOutputNone() {
    return runAlsatian(TestOutput.None);
}

async function typescriptTestOutputResult() {
    return runAlsatian(TestOutput.Result);
}

async function typescriptTestOutputCoverage() {
    return runAlsatian(TestOutput.Coverage);
}

async function typescriptTestDebug() {
    const testRunner = new TestRunner();

    testRunner.outputStream.pipe(TapBark.create().getPipeable()).pipe(process.stdout);

    const testSet = TestSet.create();

    testSet.addTestsFromFiles(debugTestFiles);

    return testRunner.run(testSet);
}

function javascriptCopyToDistributeDirectory() {
    return GulpClient.src(distributeFiles).pipe(GulpClient.dest(distributeDirectiory));
}

async function cleanBuildDirectory() {
    return del(buildDirectiory);
}

async function cleanCoverageDirectory() {
    return del(coverageDirectiory);
}

async function cleanDistributeDirectory() {
    return del(distributeDirectiory);
}

export const clean = GulpClient.parallel(cleanBuildDirectory, cleanCoverageDirectory, cleanDistributeDirectory);

export const build = GulpClient.series(clean, typescriptBuild);

export const distribute = GulpClient.series(build, javascriptCopyToDistributeDirectory);

export const lint = typescriptLint;

export const test = GulpClient.series(build, typescriptTestOutputResult);

export const coverage = GulpClient.series(build, typescriptTestOutputCoverage);

export const debug = typescriptTestDebug;

export const all = GulpClient.series(
    GulpClient.parallel(
        lint,
        clean
    ),
    typescriptBuild,
    typescriptTestOutputNone,
    javascriptCopyToDistributeDirectory
);

exports.default = all;
