import { Assign, Binary, Expr, Grouping, Literal, Unary, Visitor } from "./expr";
import { RuntimeError } from "./runtimerror";
import { Token } from "./token";
import { TokenType } from "./token-type";

export class Interperter extends Visitor {
    constructor() {
        super()
    }

    interperter(expression: Expr) {
        try {
            const value = this.evaluate(expression)
            console.log(this.stringify(value))
        } catch (error) {

        }
    }


    override visitLiteralExpr(expr: Literal) {
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
                if (typeof left === 'string' && typeof right === 'string') {
                    return `${left}${right}`
                }
                throw new RuntimeError(expr.operator, `Operands must be to numbers or two strings`)
            case TokenType.MINUS:
                this.checkNumberOperand(expr.operator, right)
                return Number(left) - Number(right)


            case TokenType.STAR:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) * Number(right)

            case TokenType.SLASH:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) / Number(right);

        }
        return null;
    }

    visitAssignExpr(expr: Assign) {
        throw new Error(`not implments`)
    }

    private checkNumberOperands(operator: Token, left: any, right: any) {
        if (typeof left === "number" && typeof right === 'number') {
            return
        }
        throw new RuntimeError(operator, "Operands must be numbers.")
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
            return `nil`
        }
        if (typeof object === 'number') {
            let text = `${object}`
            if (text.endsWith(`.0`)) {
                text = text.substring(0, text.length - 2);
            }
            return text

        }
        return `${object}`
    }


    private isTruthy(object: any) {
        if (object == null) return false;
        if (typeof object === "boolean") return Boolean(object);
        return true;
    }

    private evaluate(expr: Expr) {
        return expr.accept(this);
    }
}

