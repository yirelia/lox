import { Assign, Binary, Expression, Grouping, Literal, Unary } from "./expression";
import { Print } from "./print";

export interface Visitor {
    visitAssignExpr(expr: Assign): any;
    visitBinaryExpr(expr: Binary): any;
    visitGroupingExpr(expr: Grouping): any;
    visitLiteralExpr(expr: Literal): any;
    visitUnaryExpr(expr: Unary): any;
    visitExpressionStmt(stmt: Expression): any;
    visitPrintStmt(stmt: Print): any;
}
