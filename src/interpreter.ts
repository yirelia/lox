import { Environment } from "./Environment ";
import { RuntimeError } from "./error/runtimerror";
import { Lox } from "./lox";
import * as Stmt from "./Stmt";
import { Assign, Binary, Grouping, Literal, Unary, Visitor } from "./Stmt";
import { Token } from "./token";
import { TokenType } from "./token-type";
export class Interperter implements Visitor {
  constructor() { }

  private environment = new Environment()

  interperter(stmts: Stmt.Stmt[]) {
    try {
      for (const stmt of stmts) {
        this.evaluate(stmt);
      }
    } catch (error) {
      Lox.runtimeError(error as RuntimeError);
    }
  }

  visitExpressionStmt(stmt: Stmt.Expression) {
    return this.evaluate(stmt.expression);
  }

  visitPrintStmt(stmt: Stmt.Print) {
    const value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
    return null;
  }

  visitVarStmt(stmt: Stmt.Var) {
    let value: any = null;
    if (stmt.initializer) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
    return null;
  }

  visitAssignExpr(expr: Assign) {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value
  }

  visitLiteralExpr(expr: Literal) {
    return expr.value;
  }

  visitGroupingExpr(expr: Grouping) {
    return this.evaluate(expr.expression);
  }

  visitUnaryExpr(expr: Unary) {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -Number(right);
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    return null;
  }

  visitVariableExpr(expr: Stmt.Variable) {
    return this.environment.get(expr.name);
  }

  visitBinaryExpr(expr: Binary) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) <= Number(right);
      case TokenType.BANG_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return `${left}${right}`;
        }
        throw new RuntimeError(
          expr.operator,
          `Operands must be to numbers or two strings`
        );
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return Number(left) - Number(right);

      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) * Number(right);

      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) / Number(right);
    }
    return null;
  }


  private checkNumberOperands(operator: Token, left: any, right: any) {
    if (typeof left === "number" && typeof right === "number") {
      return;
    }
    throw new RuntimeError(operator, "Operands must be numbers.");
  }

  private checkNumberOperand(operator: Token, operand: any) {
    if (operand instanceof Number) {
      return true;
    }
    throw new RuntimeError(operator, "Operand must be a number.");
  }

  private isEqual(a: object, b: object) {
    if (a === null && b === null) return true;
    if (a == null) return false;
    if (b == null) return false;
    return a === b;
  }

  private stringify(object: object) {
    if (object == null) {
      return `nil`;
    }
    if (typeof object === "number") {
      let text = `${object}`;
      if (text.endsWith(`.0`)) {
        text = text.substring(0, text.length - 2);
      }
      return text;
    }
    return `${object}`;
  }

  private isTruthy(object: any) {
    if (object == null) return false;
    if (typeof object === "boolean") return Boolean(object);
    return true;
  }

  private evaluate(stmt: Stmt.Stmt) {
    return stmt.accept(this);
  }

  private evaluateBlock(statements: Stmt.Stmt[], environment: Environment) {
    const previous = this.environment;
    try {
      this.environment = environment
      for (const stmt of statements) {
        this.evaluate(stmt);
      }
    } finally {
      this.environment = previous
    }
  }

  visitBlockStmt(stmt: Stmt.Block) {
    this.evaluateBlock(stmt.statements, new Environment(this.environment));
    return null;
  }


}
