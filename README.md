
# json2csv

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/khaeransori.json2csv)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/khaeransori.json2csv)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/stars/khaeransori.json2csv)
![GitHub License](https://img.shields.io/github/license/khaeransori/vscode-json2csv)
![GitHub Issues](https://img.shields.io/github/issues/khaeransori/vscode-json2csv)
![GitHub Last Commit](https://img.shields.io/github/last-commit/khaeransori/vscode-json2csv)
![Maintenance](https://img.shields.io/maintenance/yes/2024)

**json2csv** is a Visual Studio Code extension that allows you to easily convert between JSON and CSV formats, directly within the editor. It is designed to simplify data manipulation and format conversion for developers and data analysts, with support for **lossless conversion of big integer numbers**.

## Features

- **Convert JSON to CSV**: Transform JSON files into CSV format with customizable options.
- **Convert CSV to JSON**: Easily convert CSV files back into JSON format.
- **Customizable Options**: Configure delimiters, headers, and other formatting options for the output.
- **Lossless Conversion for Big Integer Numbers**: Ensures large integers are accurately converted without losing precision during format conversion.
- **Supports Complex JSON Structures**: Handles nested objects and arrays, with options to expand array objects.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions panel (or press `Ctrl+Shift+X`).
3. Search for `json2csv`.
4. Click **Install**.

Alternatively, install directly from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=khaeransori.json2csv).

## Usage

### Convert JSON to CSV

1. Open a JSON file.
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the Command Palette.
3. Type `Convert JSON to CSV` and select the command.
4. The converted CSV will be displayed in a new editor tab.

### Convert CSV to JSON

1. Open a CSV file.
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the Command Palette.
3. Type `Convert CSV to JSON` and select the command.
4. The converted JSON will be displayed in a new editor tab.

## Configuration

You can customize the behavior of `json2csv` through the following configuration options:

### toCSV Configuration
- `json2csv.toCSV.arrayIndexesAsKeys` (default: `false`): Should array indexes be included in the generated keys?
_Note: This provides a more accurate representation of the JSON in the returned CSV, but may be less human readable. See [#207](https://github.com/mrodrig/json-2-csv/issues/207) for more details._
- `json2csv.toCSV.checkSchemaDifferences` (default: `false`): Should all documents have the same schema?
_Note: An error will be thrown if some documents have differing schemas when this is set to `true`._
- `json2csv.toCSV.delimiter.field` (default: `,`): Field delimiter for CSV.
- `json2csv.toCSV.delimiter.wrap` (default: `"`): Wrap values in the delimiter of choice.
- `json2csv.toCSV.delimiter.eol` (default: `\n`): End of line delimiter.
- `json2csv.toCSV.emptyFieldValue` (default: none): Value that, if specified, will be substituted in for field values that are `undefined`, `null`, or an empty string.
- `json2csv.toCSV.excelBOM` (default: `false`): Should a unicode character be prepended to allow Excel to open a UTF-8 encoded file with non-ASCII characters present.
- `json2csv.toCSV.expandNestedObjects` (default: `true`): Should nested objects be deep-converted to CSV?
_Note: Set this to `false` may result in CSV output that does not map back exactly to the original JSON_
- `json2csv.toCSV.expandArrayObjects` (default: `false`): Should objects in array values be deep-converted to CSV?
_Note: This may result in CSV output that does not map back exactly to the original JSON. See [#102](https://github.com/mrodrig/json-2-csv/issues/102) for more information._
- `json2csv.toCSV.prependHeader` (default: `true`): Should the auto-generated header be prepended as the first line in the CSV?
- `json2csv.toCSV.sortHeader` (default: `false`): Should the header keys be sorted in alphabetical order?
- `json2csv.toCSV.trimFieldValues` (default: `false`): Should the field values be trimmed?
- `json2csv.toCSV.trimHeaderFields` (default: `false`): Should the header fields be trimmed?
- `json2csv.toCSV.useDateIso8601Format` (default: `false`): Should date values be converted to an ISO8601 date string?
_Note: If selected, values will be converted using `toISOString()` rather than `toString()` or `toLocaleString()` depending on the other options provided._
- `json2csv.toCSV.useLocaleFormat` (default: `false`): Should boolean values be wrapped in wrap delimiters to prevent Excel from converting them to Excel's TRUE/FALSE Boolean values.
- `json2csv.toCSV.preventCsvInjection` (default: `false`): Should CSV injection be prevented by left trimming these characters: Equals (=), Plus (+), Minus (-), At (@), Tab (0x09), Carriage return (0x0D).

### toJSON Configuration

- `json2csv.toJSON.delimiter.field` (default: `,`): Field delimiter for CSV.
- `json2csv.toJSON.delimiter.wrap` (default: `"`): Wrap values in the delimiter of choice.
- `json2csv.toJSON.delimiter.eol` (default: `\n`): End of line delimiter.
- `json2csv.toJSON.excelBOM` (default: `false`): Should a unicode character be prepended to allow Excel to open a UTF-8 encoded file with non-ASCII characters present.
- `json2csv.toJSON.trimHeaderFields` (default: `false`): Should the header fields be trimmed?
- `json2csv.toJSON.trimFieldValues` (default: `false`): Should the field values be trimmed?
- `json2csv.toJSON.parseStringLiteralNull` (default: `false`): Should the string literal `"null"` be parsed as a `null` value?
_Note: case-insensitive comparison is used._

## Lossless Big Integer Conversion

JavaScript and JSON have limitations when handling big integers due to the `Number` type’s precision. **json2csv** handles this by ensuring lossless conversion of large integers, preserving their precision across both JSON and CSV formats. For safety, large integers are *quoted* during the conversion process to ensure they are not misinterpreted or rounded.

For example, a large integer such as:

```csv
bigNumber
900719925474099123
```

will be converted to:

```json
[
  {
    "bigNumber": "900719925474099123"
  }
]
```

and accurately preserved when converting between formats.

## Examples

### Convert JSON to CSV

Input JSON:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
]
```

Output CSV:
```csv
id,name,email
1,John Doe,john@example.com
2,Jane Doe,jane@example.com
```

### Convert CSV to JSON

Input CSV:
```csv
id,name,email
1,John Doe,john@example.com
2,Jane Doe,jane@example.com
```

Output JSON:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
]
```

## Libraries Used

This extension makes use of the following libraries:

- **[lossless-json](https://github.com/josdejong/lossless-json)** by [Jos de Jong](https://github.com/josdejong): Used for ensuring lossless conversion of big integer numbers in JSON format, preserving precision by quoting large numbers.
- **[json-2-csv](https://github.com/mrodrig/json-2-csv)** by [Manuel Rodriguez](https://github.com/mrodrig): A fast and flexible library for converting between JSON and CSV formats, used for core format conversion functionalities in this extension.

## Contribution

Feel free to contribute! Here’s how you can help:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -am 'Add a new feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
