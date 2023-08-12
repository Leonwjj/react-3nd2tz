import React from 'react';
import './index.css';
import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';

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

let treeData: DataNode[] = [
  {
    title: 'parent 1',
    children: [
      {
        title: 'parent 1-0',
        children: [
          {
            title: 'leaf',
          },
          {
            title: 'leaf',
          },
        ],
      },
      {
        title: 'parent 1-1',
        children: [{ title: 'sss' }],
      },
    ],
  },
];
treeData = assembleTree(treeData, [0], 0, 'path');
console.log(treeData, 'treeData');
const root = getPathByKey('0-0-0-0-{{2}}-{{leaf}}', treeData, 'key');
console.log(root.filter((v) => !v.children));

const App: React.FC = () => {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  return (
    <Tree
      checkable
      defaultExpandedKeys={[]}
      defaultSelectedKeys={[]}
      defaultCheckedKeys={[]}
      onSelect={onSelect}
      onCheck={onCheck}
      treeData={treeData}
    />
  );
};

export default App;
