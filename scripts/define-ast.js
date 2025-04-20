
import path from "path";
import fs from "fs";

class Writer {
  #buffer = [];

  println(message, indent) {

    if (message != null) {

        if (indent != null)
            this.write(" ".repeat(indent));
        this.write(message);

    }

    this.write("\n");

}

  toString() {
      return this.#buffer.join("");
  }

   write(message) {
      this.#buffer.push(message);
  }
}

const writer = new Writer();

class GenerateAst {
  static main(args) {
    if (args.length !== 1) {
      console.error("Usage: generate_ast <output directory>");
      process.exit(64);
    }
    const outputDir = args[0];
    this.defineAst(outputDir, "Expr", [
      "Assign   | name: Token, value: Expr",
      "Binary   | left: Expr, operator: Token, right: Expr",
      "Grouping | expression: Expr",
      "Literal  | value: any",
      "Unary    | operator: Token, right: Expr",
    ]);
  }

  static defineAst(outputDir, baseName, types) {
    const filepath = path.join(outputDir, `${baseName}.ts`);
    writer.println(`import { Token } from "../token";`);
    writer.println(`abstract class ${baseName} { constructor() { }`);
    writer.println(`abstract accept(visitor: Visitor);`);
    writer.println(`};`)

    for ( const type of types) {
      const className = type.split("|")[0].trim();
      const fields = type.split("|")[1].trim(); 
      this.defineType(writer, baseName, className, fields);
    }

    this.defineVisitor(writer, baseName, types);


    fs.writeFile(filepath, writer.toString(), "utf8", (err) => {
      if (err) {
        console.error("写入文件时出错:", err);
        return;
      }
      console.log("文件已成功写入");
    });
  }

  static defineType(writer, baseName, className, fieldList) {
    const fields = fieldList.split(",");
    console.log(fields);
    writer.println(" export class " + className + " extends " +
    baseName + " {");
    for (const field of fields) {
      writer.println("public " + field + ";");
    }

    // Constructor
    writer.println(` constructor(${fields}) {`);
    writer.println(" super();");
    for (const field of fields) {
      const name = field.split(":")[0].trim();
      writer.println(`this.${name} = ${name};`);
    }
    writer.println(" }");

    writer.println();
    writer.println("   override accept(visitor: Visitor ) {");
    writer.println("      return visitor.visit" +
        className + baseName + "(this);");
    writer.println("    }");


    writer.println(" }");

  }

  static defineVisitor(writer, baseName, types) {
    writer.println("  export abstract class Visitor{");

    for (const  type of types) {
      const typeName = type.split("|")[0].trim();
      writer.println("    visit" + typeName + baseName + "(" +
        baseName.toLowerCase() + ": " +
          typeName + ") {};");
    }

    writer.println("  }");
  }
}
// Usage: node scripts/define-ast.js <output directory>
GenerateAst.main(process.argv.slice(2));