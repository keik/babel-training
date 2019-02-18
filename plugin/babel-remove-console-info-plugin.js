const parser = require("@babel/parser");

const plugin = () => ({
  visitor: {
    CallExpression: function(path) {
      if (matchAstPattern(willRemovedCallExpressionAst, path.node)) {
        path.remove();
      }
    }
  }
});

module.exports = plugin;

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
