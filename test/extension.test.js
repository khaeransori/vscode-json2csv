/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require("assert");

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
const myExtension = require("../extension");

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function() {
  test("Should convert JSON to CSV", () => {
    const json = '{"foo": "bar", "baz": 99, "someArray": ["a", "b", "c"]}';
    myExtension.toCSV(json, (err, csv) => {
      assert.ok(csv);
      assert.equal(csv, `foo,baz,someArray\nbar,99,"[""a"",""b"",""c""]"`);
    });
  });

  test("Should fail for unparsable JSON", () => {
    const json = '{"foobar", "baz": 99, "someArray": ["a", "b", "c"]}';
    myExtension.toCSV(json, (err, csv) => {
      assert.strictEqual(csv, undefined);
    });
  });

  test("Should convert CSV to JSON", () => {
    const csv = `foo,baz,someArray\nbar,99,"[""a"",""b"",""c""]"`;
    myExtension.toJSON(csv, (err, json) => {
      assert.ok(json);
      assert.equal(json, `[{"foo":"bar","baz":99,"someArray":["a","b","c"]}]`);
    });
  });
});
