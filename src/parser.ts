import { PaserError } from "./error";
import { Lox } from "./lox";
import * as Stmt from "./stmt";
import { Binary, Expr, Grouping, Literal, Unary } from "./stmt";
import { Token } from "./token";
import { TokenType } from "./token-type";

/**
 * 原始文法
 *  expression     → equality ;
    equality       → comparison ( ( "!=" | "==" ) comparison )* ;
    comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
    term           → factor ( ( "-" | "+" ) factor )* ;
    factor         → unary ( ( "/" | "*" ) unary )* ;
    unary          → ( "!" | "-" ) unary| primary ;
    primary        → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" ;
 */
export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    return this.assignment()
  }


  private assignment(): Expr {
    const expr: Expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals: Token = this.previous();
      const value: Expr = this.assignment();

      if (expr instanceof Stmt.Variable) {
        const name: Token = expr.name;
        return new Stmt.Assign(name, value);
      }
      this.error(equals, "Invalid assignment target.");
    }
    return expr;
  }


  private or() {
    let expr: Expr = this.and();
    while (this.match(TokenType.OR)) {
      const operator: Token = this.previous();
      const right: Expr = this.and();
      expr = new Stmt.Logical(expr, operator, right);
    }
    return expr;
  }

  private and() {
    let expr: Expr = this.equality();
    while (this.match(TokenType.AND)) {
      const operator: Token = this.previous();
      const right: Expr = this.equality();
      expr = new Stmt.Logical(expr, operator, right);
    }
    return expr;
  }

  private declaration() {
    try {
      if (this.match(TokenType.FUN)) {
        return this.func('function')
      }
      if (this.match(TokenType.VAR)) {
        return this.varDeclaration();
      }
      return this.statement();
    } catch (error) {
      this.synchronize();
      return null;

    }
  }

  private statement(): Stmt.Stmt {
    if (this.match(TokenType.FOR)) {
      return this.forStatement();
    }
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
    }
    if (this.match(TokenType.PRINT)) {
      return this.printStatement();
    }
    if (this.match(TokenType.WHILE)) {
      return this.whileStatement();
    }
    if (this.match(TokenType.LEFT_BRACE)) {
      return new Stmt.Block(this.block());
    }

    return this.expressionStatement();
  }

  private forStatement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");
    let initializer: Stmt.Stmt | null;
    if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition: Expr | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");
    let increment: Expr | null = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
    let body: Stmt.Stmt = this.statement();
    if (increment) {
      body = new Stmt.Block([body, new Stmt.Expression(increment)]);
    }
    if (!condition) {
      condition = new Literal(true);
    }
    body = new Stmt.While(condition, body);
    if (initializer) {
      body = new Stmt.Block([initializer, body]);
    }
    return body
  }

  private whileStatement() {
    this.consume(TokenType.LEFT_BRACE, "Expect '(' after 'while'.");
    const condition: Expr = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
    const body: Stmt.Stmt = this.statement();
    return new Stmt.While(condition, body);
  }

  private ifStatement(): Stmt.If {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
    const condition: Expr = this.expression();
    const thenBranch: Stmt.Stmt = this.statement();
    let elseBranch: Stmt.Stmt | null = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }
    return new Stmt.If(condition, thenBranch, elseBranch);
  }

  private printStatement(): Stmt.Print {
    const value: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new Stmt.Print(value);
  }

  private varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");
    let initializer: Expr | null = null
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
    return new Stmt.Var(name, initializer);

  }

  private expressionStatement(): Stmt.Expression {
    const expr: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new Stmt.Expression(expr);
  }

  private func(kind: string) {
    let name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
    this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);
    const params: Token[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (params.length >= 255) {
          this.error(this.peek(), "Cannot have more than 255 parameters.");
        }
        params.push(this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");

    const body = this.block();
    return new Stmt.Function(name, params, body);

  }

  private block() {
    const statements: Stmt.Stmt[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration() as any);
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  private equality(): Expr {
    let expr = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }
  /**
   * @description 比较表达式
   * @returns
   */
  // comparison → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
  private comparison(): Expr {
    let expr: Expr = this.term();
    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator: Token = this.previous();
      const right: Expr = this.term();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  /**
   * @description 项表达式
   * @returns
   */
  // term → factor ( ( "-" | "+" ) factor )* ;
  private term(): Expr {
    let expr: Expr = this.factor();
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.factor();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  /**
   * @description 因子表达式
   * @returns
   */
  // factor → unary ( ( "/" | "*" ) unary )* ;
  private factor(): Expr {
    let expr: Expr = this.unary();
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  /**
   * @description 一元表达式
   * @returns
   */
  // unary → ( "!" | "-" ) unary| primary ;
  // primary → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" ;
  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();
      return new Unary(operator, right);
    }
    return this.call()
  }


  private call(): Expr {
    let expr: Expr = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }
    return expr;
  }

  private finishCall(callee: Expr): Expr {
    let args: Expr[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          this.error(this.peek(), "Cannot have more than 255 arguments.");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    const paren: Token = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after arguments.");
    return new Stmt.Call(callee, paren, args);
  }

  private primary(): Expr {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return new Stmt.Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr: Expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Grouping(expr);
    }
    throw this.error(this.peek(), ` Expect expression."`);
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  /**
   * @description 查看是否为匹配的Token 类型
   * @param types
   * @returns
   */
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private error(token: Token, message: string): PaserError {
    Lox.errorToken(token, message);
    return new PaserError();
  }

  private synchronize(): void {
    this.advance();
    switch (this.peek().type) {
      case TokenType.CLASS:
      case TokenType.FUN:
      case TokenType.VAR:
      case TokenType.FOR:
      case TokenType.IF:
      case TokenType.WHILE:
      case TokenType.PRINT:
      case TokenType.RETURN:
        return;
    }
    this.advance();
  }

  parse(): Stmt.Stmt[] {
    try {
      const statements: Stmt.Stmt[] = [];
      while (!this.isAtEnd()) {
        statements.push(this.declaration() as any);
      }
      return statements;
    } catch (error) {
      return [];
    }
  }
}
