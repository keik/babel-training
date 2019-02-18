/*
 * コードを雑に変換するサンプル
 *
 * コード内の全ての識別子を `what?` に変更する。
 */

const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

const ast = require("../parser/example");

// AST 内を探索しながらコードを書き換える。
traverse(ast, {
  // 全ての Node に入ったときに呼び出される関数
  enter(path) {
    console.log("================ enter ================");
    console.log(`type: ${path.node.type}, name: ${path.node.name}`);
  },
  // Identifier type の Node に入ったときに呼び出される関数
  // （他にも全ての Node type ごとの enter 関数を実装可能）
  Identifier: function(path) {
    console.log("================ enter (Identifier) ================");
    // 識別子を `what?` に上書きしてみる。
    console.log(`Update identifer name from '${path.node.name}' to 'what?'`);
    path.node.name = "what?";
  }
});

// 生成されたコードを見てみる。
console.log("================ transformed code ================");
console.log(generate(ast).code);
