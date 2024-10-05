import { Csv2JsonOptions } from "json-2-csv";

export type ConversionResult = {
  convertedText: string;
  convertedLanguage: string;
  success: boolean;
};

export interface ExtCsv2JsonOptions extends Csv2JsonOptions {
  parseStringLiteralNull?: boolean;
}
