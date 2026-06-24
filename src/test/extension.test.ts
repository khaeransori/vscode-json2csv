import * as assert from "assert";
import * as vscode from "vscode";
import * as myExtension from "../extension";
import { ConversionResult } from "../types";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("reviver should return a safe number", () => {
    const key = "testKey";
    const value = { isLosslessNumber: true, toString: () => "123" };
    const result = myExtension.reviver(key, value);
    assert.strictEqual(result, 123);
  });

  test("reviver should return a string for unsafe number", () => {
    const key = "testKey";
    const value = {
      isLosslessNumber: true,
      toString: () => "12345678901234567890",
    };
    const result = myExtension.reviver(key, value);
    assert.strictEqual(result, "12345678901234567890");
  });

  test("reviver should return the original value if not a lossless number", () => {
    const key = "testKey";
    const value = { isLosslessNumber: false };
    const result = myExtension.reviver(key, value);
    assert.strictEqual(result, value);
  });

  test("toCSV should convert JSON to CSV", async () => {
    const jsonText = '[{"name":"John","age":30},{"name":"Jane","age":25}]';
    const result: ConversionResult = myExtension.toCSV(jsonText);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.convertedLanguage, "csv");
    assert.ok(result.convertedText.includes("name,age"));
    assert.ok(result.convertedText.includes("John,30"));
    assert.ok(result.convertedText.includes("Jane,25"));
  });

  test("toCSV should handle invalid JSON", async () => {
    const invalidJsonText = '[{"name":"John","age":30,}]';
    const result: ConversionResult = myExtension.toCSV(invalidJsonText);
    assert.strictEqual(result.success, false);
  });

  test("toJSON should convert CSV to JSON", async () => {
    const csvText = "name,age\nJohn,30\nJane,25";
    const result: ConversionResult = myExtension.toJSON(csvText);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.convertedLanguage, "json");
    assert.ok(result.convertedText.includes('"name": "John"'));
    assert.ok(result.convertedText.includes('"age": 30'));
    assert.ok(result.convertedText.includes('"name": "Jane"'));
    assert.ok(result.convertedText.includes('"age": 25'));
  });

  test("toCSV should handle empty JSON array", async () => {
    const emptyJsonArray = "[]";
    const result: ConversionResult = myExtension.toCSV(emptyJsonArray);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.convertedLanguage, "csv");
    assert.strictEqual(result.convertedText, "\n");
  });

  test("toCSV should handle JSON with nested objects", async () => {
    const nestedJson = '[{"name":"John","address":{"city":"New York"}}]';
    const result: ConversionResult = myExtension.toCSV(nestedJson);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.convertedLanguage, "csv");
    assert.ok(result.convertedText.includes("name,address.city"));
    assert.ok(result.convertedText.includes("John,New York"));
  });

  test("toJSON should handle CSV with missing values", async () => {
    const csvWithMissingValues = "name,age\nJohn,\nJane,25";
    const result: ConversionResult = myExtension.toJSON(csvWithMissingValues);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.convertedLanguage, "json");
    assert.ok(result.convertedText.includes('"name": "John"'));
    assert.ok(result.convertedText.includes('"age": ""'));
    assert.ok(result.convertedText.includes('"name": "Jane"'));
    assert.ok(result.convertedText.includes('"age": 25'));
  });

  test("toCSV should handle JSON with different data types", async () => {
    const jsonWithDifferentTypes = '[{"name":"John","age":30,"isActive":true}]';
    const result: ConversionResult = myExtension.toCSV(jsonWithDifferentTypes);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.convertedLanguage, "csv");
    assert.ok(result.convertedText.includes("name,age,isActive"));
    assert.ok(result.convertedText.includes("John,30,true"));
  });

  test("toJSON should handle CSV with boolean values", async () => {
    const csvWithBooleanValues =
      "name,age,isActive\nJohn,30,true\nJane,25,false";
    const result: ConversionResult = myExtension.toJSON(csvWithBooleanValues);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.convertedLanguage, "json");
    assert.ok(result.convertedText.includes('"name": "John"'));
    assert.ok(result.convertedText.includes('"age": 30'));
    assert.ok(result.convertedText.includes('"isActive": true'));
    assert.ok(result.convertedText.includes('"name": "Jane"'));
    assert.ok(result.convertedText.includes('"age": 25'));
    assert.ok(result.convertedText.includes('"isActive": false'));
  });

  test("detectEol should detect CRLF, CR, LF and single-line input", () => {
    assert.strictEqual(myExtension.detectEol("a\r\nb"), "\r\n");
    assert.strictEqual(myExtension.detectEol("a\rb"), "\r");
    assert.strictEqual(myExtension.detectEol("a\nb"), "\n");
    assert.strictEqual(myExtension.detectEol("a"), undefined);
  });

  test("detectEol should key off the row terminator, not embedded breaks", () => {
    // A bare \n means LF-terminated rows even when a quoted field contains an
    // embedded \r\n, so it must not be misdetected as CRLF.
    assert.strictEqual(myExtension.detectEol('a\n"x\r\ny"'), "\n");
    // Every \n preceded by \r (incl. a trailing newline) is a real CRLF file.
    assert.strictEqual(myExtension.detectEol("a,b\r\n1,2\r\n"), "\r\n");
  });

  test("toJSON should not leave a trailing carriage return on CRLF input", () => {
    // Regression test for #22: CRLF line endings used to leave a stray \r on
    // the last column's key and value.
    const csvCRLF =
      "name,subnetName,addressPrefix,subnetPrefix\r\n" +
      "L-MDS,L-MDS-001,10.220.4.0/22,10.220.4.0/24";
    const result: ConversionResult = myExtension.toJSON(csvCRLF);
    assert.strictEqual(result.success, true);
    assert.ok(!result.convertedText.includes("\\r"));
    assert.ok(result.convertedText.includes('"subnetPrefix": "10.220.4.0/24"'));
  });

  test("toJSON should handle CR line endings", () => {
    const csvCR = "name,age\rJohn,30\rJane,25";
    const result: ConversionResult = myExtension.toJSON(csvCR);
    assert.strictEqual(result.success, true);
    assert.ok(!result.convertedText.includes("\\r"));
    assert.ok(result.convertedText.includes('"name": "John"'));
    assert.ok(result.convertedText.includes('"age": 30'));
    assert.ok(result.convertedText.includes('"name": "Jane"'));
  });

  test("toJSON should preserve an embedded CRLF inside an LF-terminated row", () => {
    // LF-terminated rows with a quoted field that contains a literal \r\n must
    // still split on \n and keep the embedded sequence in the value.
    const csv = 'name,note\n"a","line1\r\nline2"\n"b","plain"';
    const result: ConversionResult = myExtension.toJSON(csv);
    assert.strictEqual(result.success, true);
    assert.ok(result.convertedText.includes('"name": "a"'));
    assert.ok(result.convertedText.includes('"note": "line1\\r\\nline2"'));
    assert.ok(result.convertedText.includes('"name": "b"'));
    assert.ok(result.convertedText.includes('"note": "plain"'));
  });

  test("toJSON should not emit a phantom record for a trailing newline", () => {
    // A file ending in its line terminator must not yield an extra empty
    // record. This used to happen on CRLF because the trailing \r\n was kept.
    const expected = [
      { name: "John", age: 30 },
      { name: "Jane", age: 25 },
    ];
    for (const eol of ["\n", "\r\n", "\r"]) {
      const csv = `name,age${eol}John,30${eol}Jane,25${eol}`;
      const result: ConversionResult = myExtension.toJSON(csv);
      assert.strictEqual(result.success, true);
      assert.deepStrictEqual(JSON.parse(result.convertedText), expected);
    }
  });

  test("toJSON should not throw on terminator-only input", () => {
    // Stripping a trailing newline must not reduce a lone-terminator selection
    // to "" (which makes csv2json throw); it should convert successfully to a
    // valid (empty) array rather than erroring.
    for (const eol of ["\n", "\r\n", "\r"]) {
      const result: ConversionResult = myExtension.toJSON(eol);
      assert.strictEqual(result.success, true);
      assert.ok(Array.isArray(JSON.parse(result.convertedText)));
    }
  });
});
