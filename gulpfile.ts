import { TestRunner, TestSet } from 'alsatian';
import del from 'del';
import gulp from 'gulp';
import GulpTSLint from 'gulp-tslint';
import * as typescript from 'gulp-typescript';
import { TapBark } from 'tap-bark';
import * as TSGulp from 'tsgulp';
import * as TSlint from 'tslint';

@TSGulp.Project('Algorithmic')
class GulpFile {
    public distFolder = 'dist';
    public tsProject = typescript.createProject('tsconfig.json');
    public tsLintProgram = TSlint.Linter.createProgram('./tsconfig.json');

    constructor() {
        this.tsProject.config.exclude = ['gulpfile.ts', '**/**.spec.ts'];
    }

    public clean(): Promise<string[]> {
        return del(this.distFolder);
    }

    @TSGulp.Dependencies('clean')
    public compile(): void {
        this.tsProject
            .src()
            .pipe(this.tsProject())
            .pipe(gulp.dest(this.distFolder));
    }

    @TSGulp.Default()
    @TSGulp.Dependencies('compile', 'lint', 'test-no-output')
    public all(): void {
        /**/
    }

    public lint(): void {
        gulp.src('src/**/*.ts')
            .pipe(
                GulpTSLint({
                    fix: true,
                    formatter: 'stylish',
                    program: this.tsLintProgram
                })
            )
            .pipe(GulpTSLint.report());
    }

    public test(done: () => void): void {
        this.runAlsatian().then(() => done());
    }

    @TSGulp.Name('test-no-output')
    public testNoOutput(done: () => void): void {
        this.runAlsatian(false).then(() => done());
    }

    public runAlsatian(output: boolean = true): Promise<void> {
        const testSet = TestSet.create();

        testSet.addTestsFromFiles('**/*.spec.ts');

        const testRunner = new TestRunner();

        if (output) {
            testRunner.outputStream.pipe(TapBark.create().getPipeable()).pipe(process.stdout);
        }

        return testRunner.run(testSet);
    }
}
