import { Expr } from "./expression";
import { Stmt } from "./stmt";
import { Visitor } from "./visitor";

// Print statement class
export class Print implements Stmt {
    public expression: Expr;
    constructor(expression: Expr) {
        this.expression = expression;
    }

    accept(visitor: Visitor) {
        return visitor.visitPrintStmt(this);
    }
}