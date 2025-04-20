import { Scanner } from "./scanner.ts";

export class Lox {
    static hadError: boolean = false;
    public static main(args: string[]): void {

    }

    public static run(source: string) {
        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();
        for (const token of tokens) {
            console.log(token);
        }
    }


    static error(line: number, message: string): void {
        this.report(line, "", message);
    }

    static report(line: number, where: string, message: string) {
        console.error(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }
}