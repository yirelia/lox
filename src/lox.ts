import { RuntimeError } from "./error";
import { Interperter } from "./interpreter";
import { Parser } from "./parser";
import { Scanner } from "./scanner";
import { Stmt } from "./Stmt";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class Lox {
  static hadError: boolean = false;
  static hadRuntimeError = false;

  static interpreter = new Interperter();
  public static main(args: string[]): void {}

  public static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser: Parser = new Parser(tokens);
    const statements: Stmt[] = parser.parse()!;
    if (this.hadError) {
      return;
    }
    this.interpreter.interperter(statements);
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
    console.error(error.message + `\n[line ${error.token.line} ]`);
    this.hadRuntimeError = true;
  }
}
