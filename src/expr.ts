import { Token } from "./token";
export abstract class Expr {
  constructor() {}
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
export abstract class Visitor {
  visitAssignExpr(expr: Assign) {}
  visitBinaryExpr(expr: Binary) {}
  visitGroupingExpr(expr: Grouping) {}
  visitLiteralExpr(expr: Literal) {}
  visitUnaryExpr(expr: Unary) {}
}

export default {
  Expr,
  Assign,
  Binary,
  Grouping,
  Literal,
  Unary,
  Visitor,
}