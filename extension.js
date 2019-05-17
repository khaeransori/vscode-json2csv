// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const converter = require("json-2-csv");

function convertSelection(conversionFn) {
  return () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let textRange;
    if (!editor.selection.isEmpty) {
      textRange = new vscode.Range(
        editor.selection.start,
        editor.selection.end
      );
    }
    const text = editor.document.getText(textRange);
    conversionFn(text, (err, csv) => {
      if (err) {
        console.error(err);
        return;
      }
      editor.edit(edit => {
        if (!textRange) {
          textRange = new vscode.Range(
            editor.document.positionAt(0),
            editor.document.positionAt(text.length)
          );
        }
        edit.replace(textRange, csv);
      });
    });
  };
}

const toCSV = (text, callback) => {
  try {
    const json = JSON.parse(text);
    const toCSV = vscode.workspace.getConfiguration("json2csv.toCSV");
    const options = {
      checkSchemaDifferences: toCSV.checkSchemaDifferences,
      expandArrayObjects: toCSV.expandArrayObjects,
      prependHeader: toCSV.prependHeader,
      sortHeader: toCSV.sortHeader,
      delimiter: {
        field: toCSV.delimiter.field,
        wrap: toCSV.delimiter.wrap,
        eol: toCSV.delimiter.eol
      },
      excelBOM: toCSV.excelBOM,
      trimHeaderFields: toCSV.trimHeaderFields,
      trimFieldValues: toCSV.trimFieldValues
    };
    converter.json2csv(json, callback, options);
  } catch (e) {
    vscode.window.showErrorMessage("Could not parse the selection as JSON.");
    console.error(e);
    return;
  }
};
exports.toCSV = toCSV;

const toJSON = (text, callback) => {
  try {
    const toJSON = vscode.workspace.getConfiguration("json2csv.toJSON");
    const options = {
      delimiter: {
        field: toJSON.delimiter.field,
        wrap: toJSON.delimiter.wrap,
        eol: toJSON.delimiter.eol
      },
      excelBOM: toJSON.excelBOM,
      trimHeaderFields: toJSON.trimHeaderFields,
      trimFieldValues: toJSON.trimFieldValues
    };
    converter.csv2json(
      text,
      (err, res) => {
        callback(err, JSON.stringify(res));
      },
      options
    );
  } catch (e) {
    vscode.window.showErrorMessage("Could not parse the selection as CSV.");
    console.error(e);
    return;
  }
};
exports.toJSON = toJSON;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("json2csv.toCSV", convertSelection(toCSV))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("json2csv.toJSON", convertSelection(toJSON))
  );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
  toCSV,
  toJSON
};
