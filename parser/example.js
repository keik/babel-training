const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");

const code = `\
console.log("hello");

if (true) {
  const x = 1;
  console.info(x);
} else {
  const y = 2;
  console.error(y);
}
`;

// コードをパースしてASTにする。
const ast = parser.parse(code);

// ASTを見てみる。
console.log("================ AST ================");
console.log(JSON.stringify(ast, null, 2));

module.exports = ast;
