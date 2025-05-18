import {
  Assign,
  Binary,
  Expr,
  Grouping,
  Literal,
  Unary,
  Visitor,
} from "./expr";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class AstPrinter extends Visitor {
  visitAssignExpr(expr: Assign) {
    throw new Error("Method not implemented.");
  }

  print(expr: Expr) {
    return expr.accept(this as unknown as Visitor);
  }

  override visitBinaryExpr(expr: Binary) {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  override visitGroupingExpr(expr: Grouping) {
    return this.parenthesize("group", expr.expression);
  }

  override visitLiteralExpr(expr: Literal) {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }

  override visitUnaryExpr(expr: Unary) {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]) {
    let builder = `(${name}`;
    for (const expr of exprs) {
      builder += " " + expr.accept(this as unknown as Visitor);
    }
    builder += ")";
    return builder;
  }

  static main() {
    const expression = new Binary(
      new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
      new Token(TokenType.STAR, "*", null, 1),
      new Grouping(new Literal(45.67))
    );

    console.log(new AstPrinter().print(expression));
  }
}
