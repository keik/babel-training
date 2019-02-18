/*
 * ASTからコードを生成するサンプル
 */

const generate = require("@babel/generator").default;

const ast = require("../parser/example");

// AST からミニファイ済みコードを生成する。
const generated = generate(ast, { minified: true });

// 生成されたコードを見てみる。
console.log("================ generated ================");
console.log(generated);
console.log("================ code ================");
console.log(generated.code);
