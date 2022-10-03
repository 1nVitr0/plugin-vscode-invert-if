import ConfigurationService from "./ConfigurationService";

export type ErrorMessageList = Record<
  "conditionNotFound" | "parseError" | "invalidParentStatement" | "noIfBlock" | "genericError",
  string
>;
export type InfoMessageList = Record<"noChanges", string>;

export default class LanguageService {
  private errorMessages: ErrorMessageList = {
    conditionNotFound: "No condition found in selection",
    noIfBlock: "If Block not found",
    invalidParentStatement: "No valid parent Statement found",
    parseError: "Document could not be parsed",
    genericError: "An error occurred",
  };
  private infoMessages: InfoMessageList = {
    noChanges: "Successful, but no changes generated",
  };

  public constructor(private configurationService: ConfigurationService) {}

  public errorMessage(id: keyof ErrorMessageList, ...params: any[]): string {
    return params ? `${this.errorMessages[id]}: ${params.join(", ")}` : this.errorMessages[id];
  }

  public infoMessage(id: keyof InfoMessageList, ...params: any[]): string {
    return params ? `${this.infoMessages[id]}: ${params.join(", ")}` : this.infoMessages[id];
  }

  public romanNumeral(number: number): string {
    if (isNaN(number)) return "";
    const digits = String(+number).split("");
    const key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ];
    let roman = "";
    let i = 3;
    while (i--) {
      const digit = digits.pop();
      roman = (digit ? key[+digit + i * 10] : "") + roman;
    }
    return Array(+digits.join("") + 1).join("M") + roman;
  }

  public alphabeticalIndex(index: number): string {
    let result = "";
    while (index > 0) {
      result = String.fromCharCode(((index - 1) % 26) + 97) + result;
      index = Math.floor((index - 1) / 26);
    }

    return result;
  }

  public uppercaseAlphabeticalIndex(index: number): string {
    return this.alphabeticalIndex(index).toUpperCase();
  }

  public translateIndex(index: number, format: string): string {
    return format
      .replace("#1", `${index}`)
      .replace("#a", this.alphabeticalIndex(index))
      .replace("#A", this.uppercaseAlphabeticalIndex(index))
      .replace("#I", this.romanNumeral(index))
      .replace("#i", this.romanNumeral(index).toLowerCase());
  }
}
