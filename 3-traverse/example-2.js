/*
 * 特定の関数呼び出しコードを削除するサンプル。
 *
 * 削除対象の関数呼び出しコードの例として `console.info()` の AST パターンを生成し、
 * 変換対象のコード内からこの AST パターンに一致する Node を削除する操作を行う。
 */

const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

const ast = require("../1-parser/example");

// 削除するコードサンプルのASTを作る。
const willRemovedCallExpressionAst = parser.parse(`console.info()`).program
  .body[0].expression;

/**
 * 関数呼び出し式において、object 名・property 名が一致しているかどうかを判定する関数。
 *
 * ※ Node オブジェクトは様々な property を持っているので、それらの deep equal を比較しても同じパターンかどうかは判断できない。
 *    そこで「この辺が一致したら大体同じコード」かどうかを判定するための関数を作る。
 */
function matchAstPattern(node1, node2) {
  const node1Pattern = calleeMemberAstPattern(node1);
  const node2Pattern = calleeMemberAstPattern(node2);

  console.log("================ astPattern ================");
  console.log("node1 pattern:", node1Pattern);
  console.log("node2 pattern:", node2Pattern);
  return calleeMemberAstPattern(node1) === calleeMemberAstPattern(node2);

  function calleeMemberAstPattern(node, acc = []) {
    if (node.callee) {
      return calleeMemberAstPattern(node.callee);
    } else if (node.object) {
      return calleeMemberAstPattern(node.object, [
        ...acc,
        ...(node.object && node.object.name
          ? [["object", node.object.name]]
          : []),
        ...(node.property && node.property.name
          ? [["property", node.property.name]]
          : [])
      ]);
    } else {
      return JSON.stringify(acc);
    }
  }
}

// AST 内を探索しながらコードを書き換える。
traverse(ast, {
  CallExpression: function(path) {
    console.log(
      "================ enter (ExpressionStatement) ================"
    );
    if (matchAstPattern(willRemovedCallExpressionAst, path.node)) {
      console.log("!!!! AST pattern matched. This node will be removed !!!!");
      path.remove();
    }
  }
});

// 生成されたコードを見てみる。
console.log("================ transformed code ================");
console.log(generate(ast).code);
