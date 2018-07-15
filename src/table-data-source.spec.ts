import { Expect, IgnoreTest, Test, TestCase, TestFixture } from 'alsatian';
import { TableDataSource } from './table-data-source';

enum Gender {
    Male,
    Female
}

class Person {
    constructor(public firstName: string, public lastName: string, public age: number, public gender: Gender) {}
}

type PersonTableDataSource = TableDataSource<Person>;
type PTDS = PersonTableDataSource;
type E2EStepAction = (tableDataSource: PTDS) => void;
type E2EStepExpectation = (tableDataSource: PTDS) => void;

// tslint:disable-next-line:max-classes-per-file
@TestFixture('TableDataSource')
export class TableDataSourceTests {
    public JohnSmith = new Person('John', 'Smith', 16, Gender.Male);
    public FredRichards = new Person('Fred', 'Richards', 64, Gender.Male);
    public HenryLawson = new Person('Henry', 'Lawson', 81, Gender.Male);
    public BarryGoodwin = new Person('Barry', 'Goodwin', 36, Gender.Male);
    public TonyGibson = new Person('Tony', 'Gibson', 57, Gender.Male);

    public JaneSmith = new Person('Jane', 'Smith', 48, Gender.Female);
    public MarySwan = new Person('Mary', 'Swan', 72, Gender.Female);
    public MollyRichards = new Person('Molly', 'Richards', 33, Gender.Female);
    public KarenHoward = new Person('Karen', 'Howard', 9, Gender.Female);
    public FreyaClark = new Person('Freya', 'Clark', 26, Gender.Female);

    public tableDataSource = new TableDataSource<Person>([
        this.HenryLawson,
        this.TonyGibson,
        this.MarySwan,
        this.JohnSmith,
        this.BarryGoodwin,
        this.FreyaClark,
        this.MollyRichards,
        this.KarenHoward,
        this.FredRichards,
        this.JaneSmith
    ]);

    @TestCase([''])
    @TestCase([0])
    @TestCase([true])
    @TestCase([null])
    @TestCase([undefined])
    @TestCase([() => null])
    @TestCase([{}])
    @TestCase([[]])
    @Test('should be created')
    public construct1<T>(array: T[]) {
        const tableDataSource = new TableDataSource(array);

        Expect(tableDataSource).toBeDefined();
        Expect(tableDataSource instanceof TableDataSource).toBe(true);
    }

    @TestCase(
        // tslint:disable-next-line:no-empty
        (tds: PTDS) => {},
        (tds: PTDS) => {
            // tslint:disable-next-line:no-string-literal
            Expect(tds['filterProcessor'].active).toBe(true);
            // tslint:disable-next-line:no-string-literal
            Expect(tds['sorterProcessor'].active).toBe(true);
            // tslint:disable-next-line:no-string-literal
            Expect(tds['pagerProcessor'].active).toBe(true);
        }
    )
    @Test('End-to-end')
    public endToEnd1(action: E2EStepAction, expectation: E2EStepExpectation) {
        action(this.tableDataSource);
        expectation(this.tableDataSource);
    }
}
