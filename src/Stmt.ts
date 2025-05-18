import { Token } from "./token";

export interface Stmt {
  accept(visitor: Visitor): any;
}

export abstract class Expr implements Stmt {
  abstract accept(visitor: Visitor): any;
}

export class Assign extends Expr {
  public name: Token;
  public value: Expr;
  constructor(name: Token, value: Expr) {
    super();
    this.name = name;
    this.value = value;
  }

  override accept(visitor: Visitor) {
    return visitor.visitAssignExpr(this);
  }
}
export class Binary extends Expr {
  public left: Expr;
  public operator: Token;
  public right: Expr;
  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  override accept(visitor: Visitor) {
    return visitor.visitBinaryExpr(this);
  }
}
export class Grouping extends Expr {
  public expression: Expr;
  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  override accept(visitor: Visitor) {
    return visitor.visitGroupingExpr(this);
  }
}
export class Literal extends Expr {
  public value: any;
  constructor(value: any) {
    super();
    this.value = value;
  }

  override accept(visitor: Visitor) {
    return visitor.visitLiteralExpr(this);
  }
}
export class Unary extends Expr {
  public operator: Token;
  public right: Expr;
  constructor(operator: Token, right: Expr) {
    super();
    this.operator = operator;
    this.right = right;
  }

  override accept(visitor: Visitor) {
    return visitor.visitUnaryExpr(this);
  }
}
export interface Visitor {
  visitAssignExpr(expr: Assign): any;
  visitBinaryExpr(expr: Binary): any;
  visitGroupingExpr(expr: Grouping): any;
  visitLiteralExpr(expr: Literal): any;
  visitUnaryExpr(expr: Unary): any;
}

export class Expression implements Stmt {
  public expression: Expr;
  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept(visitor: Visitor) {
    return visitor.visitExpressionStmt(this);
  }
}
export class Print implements Stmt {
  public expression: Expr;
  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept(visitor: Visitor) {
    return visitor.visitPrintStmt(this);
  }
}
export interface Visitor {
  visitExpressionStmt(stmt: Expression): any;
  visitPrintStmt(stmt: Print): any;
}
