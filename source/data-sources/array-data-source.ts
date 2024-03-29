import { DataSource } from './data-source';
import {
    insert, remove, removeAt, removeMany
} from '@colonise/utilities';

/**
 * A class to handle temporal changes in a array while not mutating the array.
 */
export class ArrayDataSource<TEntry> extends DataSource<TEntry[]> {
    /**
     * The total number of entries in the table before processing.
     */
    public get length(): number {
        return this.lastInput.length;
    }

    /**
     * Creates a new ArrayDataSource with the supplied array.
     *
     * @param array The array.
     */
    public constructor(array: TEntry[] = []) {
        super(array, array);
    }

    /**
     * Appends the entries to the table.
     *
     * @param entries The entries to append.
     * @returns The newly processed table.
     */
    public push(...entries: TEntry[]): TEntry[] {
        this.lastInput.push(...entries);

        return this.reprocess();
    }

    /**
     * Inserts the entry into the table at the given index.
     *
     * @param index The index of the table that the entry will be inserted into.
     * @param entry The entry to insert.
     */
    public insert(index: number, entry: TEntry): TEntry[];

    /**
     * Inserts the entries into the table at the given index.
     *
     * @param index The index of the table that the entries will be inserted into.
     * @param entries The entries to insert.
     */
    public insert(index: number, entries: TEntry[]): TEntry[];
    public insert(index: number, entryOrEntries: TEntry | TEntry[]): TEntry[] {
        insert(this.lastInput, index, entryOrEntries);

        return this.reprocess();
    }

    /**
     * Removes the entry from the table.
     *
     * @param entry The entry to remove.
     * @returns The newly processed table.
     */
    public remove(entry: TEntry): TEntry[];

    /**
     * Removes the entries from the table.
     *
     * @param entries The entries to remove.
     * @returns The newly processed table.
     */
    public remove(entries: TEntry[]): TEntry[];

    /**
     * Removes a number of entries from the table from the supplied index and count.
     *
     * @param index The index of the first entry to remove.
     * @param count The number of entries to remove. Defaults to 1.
     * @returns The newly processed table.
     */
    public remove(index: number, count?: number): TEntry[];
    public remove(indexOrEntryOrEntries: number | TEntry | TEntry[], count: number = 1): TEntry[] {
        if (typeof indexOrEntryOrEntries === 'number') {
            removeAt(this.lastInput, indexOrEntryOrEntries, count);
        }
        else if (Array.isArray(indexOrEntryOrEntries)) {
            removeMany(this.lastInput, indexOrEntryOrEntries);
        }
        else {
            remove(this.lastInput, indexOrEntryOrEntries);
        }

        return this.reprocess();
    }

    /**
     * Assigns the entry into the table at the given index.
     *
     * @param index The index of the table that the entry will be assigned to.
     * @param entry The entry to assign.
     * @returns The newly processed table.
     */
    public assign(index: number, entry: TEntry): TEntry[] {
        this.lastInput[index] = entry;

        return this.reprocess();
    }
}
