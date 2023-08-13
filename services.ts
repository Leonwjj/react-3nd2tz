import { treeData } from './mock';

const getTreeData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(treeData), 2000);
  });
};
export { getTreeData };
