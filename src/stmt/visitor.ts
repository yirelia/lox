import { Assign, Binary, Block, Expression, Grouping, If, Literal, Logical, Unary, Var, Variable } from "./expression";
import { Print } from "./print";

export interface Visitor {
    visitAssignExpr(expr: Assign): any;
    visitBinaryExpr(expr: Binary): any;
    visitGroupingExpr(expr: Grouping): any;
    visitLiteralExpr(expr: Literal): any;
    visitUnaryExpr(expr: Unary): any;

    visitVariableExpr(expr: Variable): any;
    visitLogicalExpr(expr: Logical): any

    // 语句
    visitExpressionStmt(stmt: Expression): any;
    visitPrintStmt(stmt: Print): any;
    visitBlockStmt(stme: Block): any;
    // visitFunctionStmt(stmt: Function): any;
    visitIfStmt(stmt: If): any;
    // visitPrintStmt(stmt: Print): any;
    // visitReturnStmt(stmt: Return): any;
    visitVarStmt(stmt: Var): any;
    // visitWhileStmt(stmt: While): any;
}
