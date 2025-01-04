/**
 * Options for converting a string index to its line and column position.
 */
export type Options = {
    /**
     * Whether to use 1-based or 0-based indexing for the result.
     *
     * @default false
     */
    readonly oneBased?: boolean;
};

/**
 * Represents a line and column position in a string.
 */
export type LineColumnPosition = {
    line: number;
    column: number;
};

/**
 * Prevents `String#lastIndexOf` from treating negative indices as `0`.
 *
 * @param string - The string to search within.
 * @param searchString - The string to search for.
 * @param index - The index to start searching from.
 * @returns The last index of the search string or -1 if not found.
 */
function safeLastIndexOf(
    string: string,
    searchString: string,
    index: number
): number {
    return index < 0 ? -1 : string.lastIndexOf(searchString, index);
}

/**
 * Gets the line and column position for a given index in a string.
 *
 * @param text - The text to analyze.
 * @param textIndex - The index to find the line and column for.
 * @returns The line and column position.
 */
function getPosition(text: string, textIndex: number): LineColumnPosition {
    const lineBreakBefore = safeLastIndexOf(text, '\n', textIndex - 1);
    const column = textIndex - lineBreakBefore - 1;

    let line = 0;
    for (
        let index = lineBreakBefore;
        index >= 0;
        index = safeLastIndexOf(text, '\n', index - 1)
    ) {
        line++;
    }

    return { line, column };
}

// noinspection JSUnusedGlobalSymbols
/**
 * Convert a string index to its line and column position.
 *
 * @param text - The text in which to find the line and column position.
 * @param textIndex - The index in the string for which to find the line and column position.
 * @param options - Configuration options.
 * @returns The line and column position.
 *
 * @example
 * ```
 * import indexToLineColumn from './index';
 *
 * const result = indexToLineColumn('Hello\nWorld', 7, { oneBased: true });
 * console.log(result);
 * //=> { line: 2, column: 2 }
 * ```
 */
export default function indexToLineColumn(
    text: string,
    textIndex: number,
    options?: Options
): LineColumnPosition {
    if (!Number.isInteger(textIndex)) {
        throw new TypeError('Index parameter should be an integer');
    }

    if (textIndex < 0 || (textIndex >= text.length && text.length > 0)) {
        throw new RangeError('Index out of bounds');
    }

    const { oneBased = false } = options ?? {};
    const position = getPosition(text, textIndex);

    return oneBased
        ? { line: position.line + 1, column: position.column + 1 }
        : position;
}
