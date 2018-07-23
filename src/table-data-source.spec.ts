import { Expect, IgnoreTest, Setup, Test, TestCase, TestFixture } from 'alsatian';
import { Filter, FilterProcessor, Sorter } from './processors';
import { TableDataSource } from './table-data-source';

enum Gender {
    Male,
    Female
}

class Person {
    constructor(
        public firstName: string,
        public lastName: string,
        public age: number,
        public gender: Gender,
        public alive: boolean
    ) {}
}

// tslint:disable-next-line:max-classes-per-file
class TestData {
    public static JohnSmith = new Person('John', 'Smith', 16, Gender.Male, true);
    public static FredRichards = new Person('Fred', 'Richards', 64, Gender.Male, true);
    public static HenryLawson = new Person('Henry', 'Lawson', 81, Gender.Male, false);
    public static BarryGoodwin = new Person('Barry', 'Goodwin', 36, Gender.Male, true);
    public static TonyGibson = new Person('Tony', 'Gibson', 57, Gender.Male, false);

    public static JaneSmith = new Person('Jane', 'Smith', 48, Gender.Female, false);
    public static MarySwan = new Person('Mary', 'Swan', 72, Gender.Female, true);
    public static MollyRichards = new Person('Molly', 'Richards', 33, Gender.Female, false);
    public static KarenHoward = new Person('Karen', 'Howard', 9, Gender.Female, true);
    public static FreyaClark = new Person('Freya', 'Clark', 26, Gender.Female, true);

    public static people: Person[] = [];
    public static tableDataSource = new TableDataSource<Person>([]);
}

// tslint:disable-next-line:max-classes-per-file
@TestFixture('TableDataSource')
export class TableDataSourceTests {
    @Setup
    public setup() {
        TestData.people = [
            TestData.HenryLawson,
            TestData.TonyGibson,
            TestData.MarySwan,
            TestData.JohnSmith,
            TestData.BarryGoodwin,
            TestData.FreyaClark,
            TestData.MollyRichards,
            TestData.KarenHoward,
            TestData.FredRichards,
            TestData.JaneSmith
        ];

        TestData.tableDataSource = new TableDataSource<Person>(TestData.people);
    }

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

    @TestCase('alive', [
        TestData.JohnSmith,
        TestData.FredRichards,
        TestData.BarryGoodwin,
        TestData.MarySwan,
        TestData.KarenHoward,
        TestData.FreyaClark
    ])
    @TestCase('gender', [
        TestData.JaneSmith,
        TestData.MarySwan,
        TestData.MollyRichards,
        TestData.KarenHoward,
        TestData.FreyaClark
    ])
    @Test('PropertyFilter should correctly filter the output data')
    public PropertyFilter1(filter: Filter<Person>, expected: Person[]) {
        TestData.tableDataSource.filter = filter;

        const actual = TestData.tableDataSource.get();

        Expect(actual.length).toBe(expected.length);

        expected.forEach(expectedPerson => {
            Expect(actual).toContain(expectedPerson);
        });
    }

    @TestCase({ property: 'alive', value: true }, [
        TestData.JohnSmith,
        TestData.FredRichards,
        TestData.BarryGoodwin,
        TestData.MarySwan,
        TestData.KarenHoward,
        TestData.FreyaClark
    ])
    @TestCase({ property: 'alive', value: false }, [
        TestData.HenryLawson,
        TestData.TonyGibson,
        TestData.JaneSmith,
        TestData.MollyRichards
    ])
    @TestCase({ property: 'gender', value: Gender.Male }, [
        TestData.JohnSmith,
        TestData.FredRichards,
        TestData.HenryLawson,
        TestData.BarryGoodwin,
        TestData.TonyGibson
    ])
    @TestCase({ property: 'gender', value: Gender.Female }, [
        TestData.JaneSmith,
        TestData.MarySwan,
        TestData.MollyRichards,
        TestData.KarenHoward,
        TestData.FreyaClark
    ])
    @Test('PropertyAndValueFilter should correctly filter the output data')
    public PropertyAndValueFilter1(filter: Filter<Person>, expected: Person[]) {
        TestData.tableDataSource.filter = filter;

        const actual = TestData.tableDataSource.get();

        Expect(actual.length).toBe(expected.length);

        expected.forEach(expectedPerson => {
            Expect(actual).toContain(expectedPerson);
        });
    }

    @TestCase((person: Person) => person.alive, [
        TestData.JohnSmith,
        TestData.FredRichards,
        TestData.BarryGoodwin,
        TestData.MarySwan,
        TestData.KarenHoward,
        TestData.FreyaClark
    ])
    @TestCase((person: Person) => !person.alive, [
        TestData.HenryLawson,
        TestData.TonyGibson,
        TestData.JaneSmith,
        TestData.MollyRichards
    ])
    @TestCase((person: Person) => person.gender === Gender.Male, [
        TestData.JohnSmith,
        TestData.FredRichards,
        TestData.HenryLawson,
        TestData.BarryGoodwin,
        TestData.TonyGibson
    ])
    @TestCase((person: Person) => person.gender === Gender.Female, [
        TestData.JaneSmith,
        TestData.MarySwan,
        TestData.MollyRichards,
        TestData.KarenHoward,
        TestData.FreyaClark
    ])
    @TestCase((person: Person) => person.age > 50, [
        TestData.FredRichards,
        TestData.HenryLawson,
        TestData.TonyGibson,
        TestData.MarySwan
    ])
    @TestCase((person: Person) => person.age < 50, [
        TestData.JohnSmith,
        TestData.BarryGoodwin,
        TestData.JaneSmith,
        TestData.MollyRichards,
        TestData.KarenHoward,
        TestData.FreyaClark
    ])
    @Test('FunctionFilter should correctly filter the output data')
    public FunctionFilter1(filter: Filter<Person>, expected: Person[]) {
        TestData.tableDataSource.filter = filter;

        const actual = TestData.tableDataSource.get();

        Expect(actual.length).toBe(expected.length);

        expected.forEach(expectedPerson => {
            Expect(actual).toContain(expectedPerson);
        });
    }

    @TestCase('firstName', [
        TestData.BarryGoodwin,
        TestData.FredRichards,
        TestData.FreyaClark,
        TestData.HenryLawson,
        TestData.JaneSmith,
        TestData.JohnSmith,
        TestData.KarenHoward,
        TestData.MarySwan,
        TestData.MollyRichards,
        TestData.TonyGibson
    ])
    @TestCase('lastName', [
        TestData.FreyaClark,
        TestData.TonyGibson,
        TestData.BarryGoodwin,
        TestData.KarenHoward,
        TestData.HenryLawson,
        TestData.MollyRichards,
        TestData.FredRichards,
        TestData.JohnSmith,
        TestData.JaneSmith,
        TestData.MarySwan
    ])
    @TestCase('age', [
        TestData.KarenHoward,
        TestData.JohnSmith,
        TestData.FreyaClark,
        TestData.MollyRichards,
        TestData.BarryGoodwin,
        TestData.JaneSmith,
        TestData.TonyGibson,
        TestData.FredRichards,
        TestData.MarySwan,
        TestData.HenryLawson
    ])
    @TestCase('gender', [
        TestData.HenryLawson,
        TestData.TonyGibson,
        TestData.JohnSmith,
        TestData.BarryGoodwin,
        TestData.FredRichards,
        TestData.MarySwan,
        TestData.FreyaClark,
        TestData.MollyRichards,
        TestData.KarenHoward,
        TestData.JaneSmith
    ])
    @TestCase('alive', [
        TestData.HenryLawson,
        TestData.TonyGibson,
        TestData.MollyRichards,
        TestData.JaneSmith,
        TestData.MarySwan,
        TestData.JohnSmith,
        TestData.BarryGoodwin,
        TestData.FreyaClark,
        TestData.KarenHoward,
        TestData.FredRichards
    ])
    @Test('PropertySorter should correctly sort the output data')
    public PropertySorter1(sorter: Sorter<Person>, expected: Person[]) {
        TestData.tableDataSource.sorter = sorter;

        const actual = TestData.tableDataSource.get();

        Expect(actual).toEqual(expected);
    }

    @TestCase(TestData.BarryGoodwin, [
        TestData.HenryLawson,
        TestData.TonyGibson,
        TestData.MarySwan,
        TestData.JohnSmith,
        TestData.BarryGoodwin,
        TestData.FreyaClark,
        TestData.MollyRichards,
        TestData.KarenHoward,
        TestData.FredRichards,
        TestData.JaneSmith,
        TestData.BarryGoodwin
    ])
    @Test('.push() should append a new row to the TableDataSource')
    public push1(person: Person, expected: Person[]) {
        TestData.tableDataSource.push(person);

        const actual = TestData.tableDataSource.get();

        Expect(actual).toEqual(expected);
    }
}
