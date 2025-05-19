import { Lox } from "./lox";

let source = `print "hi" or 2; // "hi".
print nil or "yes"; // "yes".`

Lox.run(source)