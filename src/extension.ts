// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { csv2json, json2csv } from "json-2-csv";
import { Csv2JsonOptions, Json2CsvOptions } from "json-2-csv";
import { parse, isSafeNumber } from "lossless-json";
import { ConversionResult, ExtCsv2JsonOptions } from "./types";

export function reviver(key: string, value: any) {
  if (value && value.isLosslessNumber) {
    try {
      const str = value.toString();
      if (isSafeNumber(str)) {
        return Number(str);
      }

      return str;
    } catch (err) {
      return value;
    }
  }

  return value;
}

export function convertSelectedText(
  conversionFn: (text: string) => ConversionResult,
  copyToClipboard = false
) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  //get the selected text range, if no text is selected then select the whole document
  let textRange;
  if (!editor.selection.isEmpty) {
    textRange = new vscode.Range(editor.selection.start, editor.selection.end);
  }

  const text = editor.document.getText(textRange);
  //convert the selected text
  const {
    convertedText,
    convertedLanguage: language,
    success,
  } = conversionFn(text);

  //if the conversion failed, show an error message
  if (!success) {
    return;
  }

  //copy the converted text to the clipboard
  if (copyToClipboard) {
    vscode.env.clipboard.writeText(convertedText);
    vscode.window.showInformationMessage(
      `The converted text has been copied to the clipboard.`
    );
    return;
  }
  vscode.workspace
    .openTextDocument({
      content: convertedText,
      language,
    })
    .then((doc) => {
      vscode.window.showTextDocument(doc);
    });
}

export function toCSV(text: string): ConversionResult {
  try {
    const json = parse(text, reviver) as object[];
    const config = vscode.workspace.getConfiguration(
      "json2csv.toCSV"
    ) as Json2CsvOptions;
    const options: Json2CsvOptions = {
      arrayIndexesAsKeys: config.arrayIndexesAsKeys,
      checkSchemaDifferences: config.checkSchemaDifferences,
      delimiter: config.delimiter
        ? {
            wrap: config.delimiter.wrap,
            field: config.delimiter.field,
            eol: config.delimiter.eol,
          }
        : undefined,
      emptyFieldValue: config.emptyFieldValue,
      excelBOM: config.excelBOM,
      expandNestedObjects: config.expandNestedObjects,
      expandArrayObjects: config.expandArrayObjects,
      prependHeader: config.prependHeader,
      sortHeader: config.sortHeader,
      trimHeaderFields: config.trimHeaderFields,
      trimFieldValues: config.trimFieldValues,
      useDateIso8601Format: config.useDateIso8601Format,
      useLocaleFormat: config.useLocaleFormat,
      wrapBooleans: config.wrapBooleans,
      preventCsvInjection: config.preventCsvInjection,
    };
    const convertedText = json2csv(json, options);
    return {
      convertedText,
      convertedLanguage: "csv",
      success: true,
    };
  } catch (error) {
    let reason = "";
    if (error instanceof Error) {
      reason = "Reason: " + error.message;
    }
    vscode.window.showErrorMessage(
      `Could not convert the selection to CSV. ${reason}`
    );
    return {
      convertedText: "",
      convertedLanguage: "csv",
      success: false,
    };
  }
}

export function toJSON(text: string): ConversionResult {
  try {
    const csv = text;
    const config = vscode.workspace.getConfiguration(
      "json2csv.toJSON"
    ) as ExtCsv2JsonOptions;
    const options: Csv2JsonOptions = {
      delimiter: config.delimiter
        ? {
            wrap: config.delimiter.wrap,
            field: config.delimiter.field,
            eol: config.delimiter.eol,
          }
        : undefined,
      excelBOM: config.excelBOM,
      trimHeaderFields: config.trimHeaderFields,
      trimFieldValues: config.trimFieldValues,
      parseValue: (fieldValue: string) => {
        //if the string is actually literal null string, return null. case insensitive
        if (
          config.parseStringLiteralNull &&
          (fieldValue === null || fieldValue.toLowerCase() === "null")
        ) {
          return null;
        }

        return parse(fieldValue, reviver);
      },
    };
    const convertedText = csv2json(csv, options);
    return {
      convertedText: JSON.stringify(convertedText, null, 2) as string,
      convertedLanguage: "json",
      success: true,
    };
  } catch (error) {
    let reason = "";
    if (error instanceof Error) {
      reason = "Reason: " + error.message;
    }
    vscode.window.showErrorMessage(
      `Could not convert the selection to JSON. ${reason}`
    );
    return {
      convertedText: "",
      convertedLanguage: "json",
      success: false,
    };
  }
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("json2csv.toCSV", () =>
      convertSelectedText(toCSV)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("json2csv.toJSON", () =>
      convertSelectedText(toJSON)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("json2csv.toCSV.clipboard", () =>
      convertSelectedText(toCSV, true)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("json2csv.toJSON.clipboard", () =>
      convertSelectedText(toJSON, true)
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
