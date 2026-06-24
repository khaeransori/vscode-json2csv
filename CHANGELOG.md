# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-06-24

### Fixed
- CSV to JSON conversion now auto-detects the input's line endings, so CRLF (Windows) and CR (classic Mac) files no longer leave a stray carriage return on the last field of each row, and input ending in a trailing newline no longer produces an empty trailing record ([#22](https://github.com/khaeransori/vscode-json2csv/issues/22)).

### Removed
- The `json2csv.toJSON.delimiter.eol` setting, which no longer had any effect now that line endings are auto-detected when parsing CSV. Output line endings remain configurable via `json2csv.toCSV.delimiter.eol`.

## [1.0.0] - 2024-10-01

### Added
- **Lossless conversion** for large integers: big integers are now quoted to preserve precision during format conversion.
- Convert JSON to CSV and CSV to JSON with customizable options.
- Support for nested JSON structures and expanding array objects.
- Various customization options for delimiters, headers, and end-of-line settings.
- Documentation updates, including feature explanations and use cases in `README.md`.
- Badge support for version, downloads, rating, and license in `README.md`.

### Changed
- Updated `README.md` with credits to [lossless-json](https://github.com/josdejong/lossless-json) and [json-2-csv](https://github.com/mrodrig/json-2-csv) libraries.

## [0.0.1] - 2019-05-10

### Added
- Initial release with basic conversion capabilities:
  - Convert JSON to CSV.
  - Convert CSV to JSON.
  - Simple conversion without support for lossless large integer handling.