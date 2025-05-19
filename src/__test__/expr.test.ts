import { expect, test } from "vitest";
import { AstPrinter } from "../ast-printer";
import Expr from "../expr";
import { Token } from "../token";
import { TokenType } from "../token-type";

test(`expr`, () => {
    const printer = new AstPrinter();
    const expression = new Expr.Binary(
        new Expr.Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Expr.Literal(123)),
        new Token(TokenType.STAR, "*", null, 1),
        new Expr.Grouping(
            new Expr.Literal(45.67)));
    const result = printer.print(expression);
    expect(result).toBe("(* (- 123) (group 45.67))");

})