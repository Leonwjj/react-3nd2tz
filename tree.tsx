import React, { useState } from 'react';
import { Tree, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd/es/tree';
import names from 'classnames';
import { getTreeData } from './services';
import { assembleTree, pruneTree, getPathByKey, treeForeach } from './util';
import './index.css';

const App = (props) => {
  const { onTreeCheck, checkedIds } = props;
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  React.useEffect(() => {
    setInitLoading(true);
    getTreeData().then((res) => {
      const treeData = assembleTree(res, [0], 0, 'path');
      setTreeData(treeData);
      if (checkedIds.length) {
        const ids = checkedIds.map((key) =>
          getPathByKey(key, treeData, 'id')
            .map((v) => v.key)
            .slice(-1)
        );
        setCheckedKeys(ids.flat(2));
      }
      setInitLoading(false);
    });
  }, [checkedIds]);

  React.useEffect(() => {
    const data = gatherData();
    onTreeCheck && onTreeCheck(data);
  }, [checkedKeys]);

  const onRemove = (e, node) => {
    e.preventDefault();
    // arr 删除的节点和子节点的key集合
    const arr = treeForeach([node]);
    // FIXME 如果是唯一子节点递归移除父节点
    const _checkedKeys = checkedKeys.filter((key) => !arr.includes(key));
    setCheckedKeys(_checkedKeys);
  };

  const gatherData = (_checkedKeys = checkedKeys) => {
    let pruningTree = pruneTree(treeData, (node) => {
      return checkedKeys.includes(node.key);
    });
    function traverse(tree) {
      if (!tree) return;
      for (let node of tree) {
        node.title = (
          <div className={names('preview-tree-node')}>
            {node.title}
            <DeleteOutlined
              className={names('del-icon')}
              onClick={(e) => onRemove(e, node)}
            />
          </div>
        );
        if (node.children) {
          traverse(node.children);
        }
      }
      return tree;
    }
    const ids = _checkedKeys.map((key) => {
      return getPathByKey(key, treeData, 'key').filter((v) => !v.children);
    });
    return {
      checkedKeys: _checkedKeys,
      checkedTree: traverse(pruningTree),
      checkedIds: ids.map((id) => id[0]?.title).filter(Boolean),
    };
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    setCheckedKeys(checkedKeys);
  };

  return (
    <div>
      {initLoading ? (
        <Spin />
      ) : (
        <Tree
          checkable
          treeData={treeData}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
        />
      )}
    </div>
  );
};
export default App;
