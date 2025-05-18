import { Lox } from "./lox";
const source = `print "one";
print true;
print 2 + 1;`;
Lox.run(source);
