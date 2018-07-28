import { TestRunner, TestSet } from 'alsatian';
import del from 'del';
import gulp from 'gulp';
import gulpIstanbul from 'gulp-istanbul';
import GulpTSLint from 'gulp-tslint';
import * as typescript from 'gulp-typescript';
import mergeStream from 'merge-stream';
import streamToPromise from 'stream-to-promise';
import { TapBark } from 'tap-bark';
import * as TSGulp from 'tsgulp';
import * as TSlint from 'tslint';

enum TestOutput {
    None,
    Result,
    Coverage
}

@TSGulp.Project('DataSource')
class GulpFile {
    public readonly tsProject = typescript.createProject('./src/tsconfig.json');
    public readonly tsLintProgram = TSlint.Linter.createProgram('./src/tsconfig.json');

    public readonly declarationFiles = './src/**/*.d.ts';
    public readonly buildDirectiory = './build/';

    public readonly coverableFiles = ['./build/**/*.js', '!./build/**/*.spec.*'];
    public readonly testFiles = './build/**/*.spec.js';
    public readonly debugTestFiles = './src/**/*.spec.ts';

    public readonly distributeFiles = ['./build/**/*.*', '!./build/**/*.spec.*'];
    public readonly distributeDirectiory = './dist/';

    public async clean() {
        await del(this.buildDirectiory);
        await del(this.distributeDirectiory);
    }

    @TSGulp.Dependencies('clean')
    public build() {
        return mergeStream(
            this.tsProject
                .src()
                .pipe(this.tsProject())
                .pipe(gulp.dest(this.buildDirectiory)),
            gulp.src(this.declarationFiles).pipe(gulp.dest(this.buildDirectiory))
        );
    }

    @TSGulp.Dependencies('clean', 'build')
    public distribute() {
        return gulp.src(this.distributeFiles).pipe(gulp.dest(this.distributeDirectiory));
    }

    public lint() {
        return this.tsProject
            .src()
            .pipe(
                GulpTSLint({
                    fix: true,
                    formatter: 'stylish',
                    program: this.tsLintProgram
                })
            )
            .pipe(GulpTSLint.report());
    }

    @TSGulp.Dependencies('build')
    public test() {
        return this.runAlsatian(TestOutput.Result);
    }

    @TSGulp.Dependencies('build')
    @TSGulp.Name('test-no-output')
    public testNoOutput() {
        return this.runAlsatian(TestOutput.None);
    }

    @TSGulp.Dependencies('build')
    public coverage() {
        return this.runAlsatian(TestOutput.Coverage);
    }

    public debug() {
        const testRunner = new TestRunner();

        testRunner.outputStream.pipe(TapBark.create().getPipeable()).pipe(process.stdout);

        const testSet = TestSet.create();

        testSet.addTestsFromFiles(this.debugTestFiles);

        return testRunner.run(testSet);
    }

    public async runAlsatian(output: TestOutput) {
        const testRunner = new TestRunner();

        switch (output) {
            case TestOutput.Result:
                testRunner.outputStream.pipe(TapBark.create().getPipeable()).pipe(process.stdout);
                break;

            case TestOutput.Coverage:
                await streamToPromise(
                    gulp
                        .src(this.coverableFiles)
                        .pipe(gulpIstanbul({ includeUntested: true }))
                        .pipe(gulpIstanbul.hookRequire())
                );
                testRunner.outputStream.pipe(gulpIstanbul.writeReports({ dir: './coverage' }));
                break;
            default:
        }

        const testSet = TestSet.create();

        testSet.addTestsFromFiles(this.testFiles);

        return testRunner.run(testSet);
    }

    @TSGulp.Default()
    @TSGulp.Dependencies('lint', 'build', 'test-no-output', 'coverage', 'distribute')
    // tslint:disable-next-line:no-empty
    public all() {}
}
