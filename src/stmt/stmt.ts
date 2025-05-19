import { Visitor } from "./visitor";
export interface Stmt {
    accept(visitor: Visitor): any;
}