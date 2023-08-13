import type { DataNode } from 'antd/es/tree';
const treeData: DataNode[] = [
  {
    title: 'parent 1',
    children: [
      {
        title: 'parent 1-0',
        children: [
          {
            title: 'leaf',
            id: 1,
          },
          {
            title: 'leaf',
            id: 2,
          },
        ],
      },
      {
        title: 'parent 1-1',
        children: [{ title: 'sss', id: 3 }],
      },
    ],
  },
];
export { treeData };
