import { AstPrinter } from "./ast-printer.ts";
import { Expr } from "./expr.ts";
import { Parser } from "./parser.ts";
import { Scanner } from "./scanner.ts";
import { TokenType } from "./token-type.ts";
import { Token } from "./token.ts";

export class Lox {
  static hadError: boolean = false;
  public static main(args: string[]): void {}

  public static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser: Parser = new Parser(tokens);
    const expression: Expr = parser.parse()!;
    if (this.hadError) {
      return;
    }
    console.log(new AstPrinter().print(expression));
  }

  static error(line: number, message: string): void {
    this.report(line, "", message);
  }

  static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }

  static errorToken(token: Token, message: string): void {
    if (token.type === TokenType.EOF) {
      this.report(token.line, " at end", message);
    } else {
      this.report(token.line, ` at '${token.lexeme}'`, message);
    }
  }
}
