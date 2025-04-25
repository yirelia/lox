import { Expr } from "./expr.ts";
import { Interperter } from "./interpreter.js";
import { Parser } from "./parser.ts";
import { RuntimeError } from "./runtimerror.ts";
import { Scanner } from "./scanner.ts";
import { TokenType } from "./token-type.ts";
import { Token } from "./token.ts";

export class Lox {
  static hadError: boolean = false;
  static hadRuntimeError = false

  static interpreter = new Interperter()
  public static main(args: string[]): void { }

  public static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser: Parser = new Parser(tokens);
    const expression: Expr = parser.parse()!;
    if (this.hadError) {
      return;
    }
    this.interpreter.interperter(expression)
    // console.log(new AstPrinter().print(expression));
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

  static runtimeError(error: RuntimeError) {

    console.error(error.message + `\n[line ${error.token.line} ]`)
    this.hadRuntimeError = true;
  }
}
