import { Expr } from "./expr";
import { Token } from "./token";

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }
    
    private expression(): Expr {
        return this.equality();
      }

private equality(): Expr {
    const expr = this.comparison();
    while (this.match(BANG_EQUAL, EQUAL_EQUAL)) {
        Token operator = this.previous();
        Expr right = this.comparison();
        expr = new Expr.Binary(expr, operator, right);
      }
  
      return expr;
}

// private comparison(): Expr {
//     Expr expr = addition();
//     while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
//         Token operator = previous();
//         Expr right = addition();
//         expr = new Expr.Binary(expr, operator, right);
//     }
//     return expr;
// }
  }