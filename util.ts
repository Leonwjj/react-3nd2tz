function assembleTree(nodes, parent, depth, pathKey) {
  if (!depth) depth = 0;
  if (!pathKey) pathKey = 'id';
  nodes.forEach((n, i) => {
    const path = parent.length ? parent.concat(i) : [i]; // 数组记录path
    // n.meta = { name: n.title, role: n[pathKey], path: path, depth }
    n.key = path.join('-') + `-{{${depth}}}-{{${n.title}}}`;
    if (n.children && n.children instanceof Array) {
      assembleTree(n.children, path, depth + 1, pathKey);
    }
  });
  if (depth === 0) {
    return nodes;
  }
}
function pruneTree(tree, func) {
  // 使用map复制一下节点，避免修改到原树
  return tree
    .map((node) => ({ ...node }))
    .filter((node) => {
      node.children = node.children && pruneTree(node.children, func);
      return func(node) || (node.children && node.children.length);
    });
}
const getPathByKey = (curKey, data, pathKey) => {
  let result = []; // 记录路径结果
  let traverse = (curKey, path, data) => {
    if (data.length === 0) {
      return;
    }
    for (let item of data) {
      path.push(item);
      if (item[pathKey] === curKey) {
        result = JSON.parse(JSON.stringify(path));
        return;
      }
      const children = Array.isArray(item.children) ? item.children : [];
      traverse(curKey, path, children); // 遍历
      path.pop(); // 回溯
    }
  };
  traverse(curKey, [], data);
  return result;
};
function treeForeach(tree, arr = []) {
  let node,
    list = [...tree];
  while ((node = list.shift())) {
    arr.push(node.key);
    node.children && list.push(...node.children);
  }
  return arr;
}
export { assembleTree, pruneTree, getPathByKey, treeForeach };
