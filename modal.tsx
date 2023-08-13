import React, { useState } from 'react';
import { Button, Modal, Space, Tree } from 'antd';
import TreeSelect from './tree';

export const App = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [checkedInfo, setCheckedInfo] = useState<any>({
    checkedKeys: [],
    checkedTree: [],
    checkedIds: [],
  });
  const [dimensionId, setDimensionId] = useState<React.Key>('');
  const [checkedIds, setCheckedIds] = useState<React.Key[]>([]);

  const onOk = () => {
    setOpen(false);
  };
  const onCancel = () => {
    setOpen(false);
  };
  const onAdd = () => {
    setOpen(true);
  };
  const onEdit = (id) => {
    setDimensionId(id);
    setCheckedIds([1, 3]);
    setOpen(true);
  };
  const onTreeCheck = (data) => {
    console.log(data, 'data');
    setCheckedInfo(data);
  };

  return (
    <>
      <Button type="primary" onClick={() => onAdd()}>
        新增
      </Button>
      <Button type="primary" onClick={() => onEdit(1)}>
        编辑
      </Button>
      <Modal open={open} onOk={onOk} onCancel={onCancel}>
        <Space>
          <TreeSelect onTreeCheck={onTreeCheck} checkedIds={checkedIds} />
          <Tree treeData={checkedInfo.checkedTree} />
          <Tree
            checkable
            treeData={[
              {
                title: '原始维值',
                key: '111',
                children: checkedInfo.checkedTree,
              },
              {
                title: '自定义维值',
                key: '222',
                children: [
                  { title: '自定义维值1', key: '222-1' },
                  { title: '自定义维值2', key: '222-2' },
                ],
              },
            ]}
            onCheck={(checkedKeys, info) => {
              console.log(checkedKeys);
              console.log(info);
            }}
          />
        </Space>
      </Modal>
    </>
  );
};
