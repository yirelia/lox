import { Lox } from "./lox";
let source = `print "one";
print true;
print 2 + 1;`;
Lox.run(source);
// 


console.log(`${'='.repeat(20)}\n`);
source = `
var a = "global a";
var b = "global b";
var c = "global c";
{
  var a = "outer a";
   b = "outer b";
  {
    var a = "inner a";
    print a;
    print b;
    print c;
  }
  print a;
  print b;
  print c;
}
print a;
print b;
print c;
`
Lox.run(source)