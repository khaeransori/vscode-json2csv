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
});
