import { Token } from "../token";
import { Stmt } from "./stmt";
import { Visitor } from "./visitor";

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


export class Variable extends Expr {
    public name: Token;
    constructor(name: Token) {
        super();
        this.name = name;
    }

    override accept(visitor: Visitor) {
        return visitor.visitVariableExpr(this);
    }
}

export class Logical extends Expr {
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
        return visitor.visitLogicalExpr(this);
    }
}


export class Call extends Expr {
    public callee: Expr;
    public paren: Token;
    public args: Expr[];
    constructor(callee: Expr, paren: Token, args: Expr[]) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }

    override accept(visitor: Visitor) {
        return visitor.visitCallExpr(this);
    }
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


export class Var implements Stmt {
    public name: Token;
    public initializer: Expr | null;
    constructor(name: Token, initializer: Expr | null) {
        this.name = name;
        this.initializer = initializer;
    }

    accept(visitor: Visitor) {
        return visitor.visitVarStmt(this);
    }
}


export class Block implements Stmt {
    public statements: Stmt[];
    constructor(statements: Stmt[]) {
        this.statements = statements;
    }

    accept(visitor: Visitor) {
        return visitor.visitBlockStmt(this);
    }
}


export class If implements Stmt {
    public condition: Expr;
    public thenBranch: Stmt;
    public elseBranch: Stmt | null;
    constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    accept(visitor: Visitor) {
        return visitor.visitIfStmt(this);
    }
}

export class While implements Stmt {
    public condition: Expr;
    public body: Stmt;
    constructor(condition: Expr, body: Stmt) {
        this.condition = condition;
        this.body = body;
    }

    accept(visitor: Visitor) {
        return visitor.visitWhileStmt(this);
    }
}