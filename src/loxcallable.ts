import { Interpreter } from "./interpreter";

export interface LoxCallable {
    arity(): number;
    call(interpreter: Interpreter, args: any[]): any;
}

export function isLoxCallable(obj: any): obj is LoxCallable {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        typeof obj.arity === 'function' &&
        typeof obj.call === 'function'
    );
}
