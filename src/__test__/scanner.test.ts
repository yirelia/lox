import { expect, test } from "vitest";
import { Scanner } from "../scanner";
test(`scanner Var`, () => {
    const source = `Var name = "Lox";`
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    expect(tokens[0].lexeme).toBe("Var");
    expect(tokens[0].line).toBe(1);
})

