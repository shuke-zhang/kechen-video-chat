import { flatMapDeep } from 'lodash-es'

/**
 * 将树形结构拍平为一维数组
 * @param tree - 节点数组
 * @param childrenKey - 子节点字段名，默认 'children'
 */
export function getTreeFlatList<T extends Record<string, any>>(
  tree: T[],
  childrenKey: keyof T = 'children' as keyof T,
): T[] {
  return flatMapDeep(tree, (item: T): (T | T[])[] => {
    const children = item[childrenKey] as unknown as T[] | undefined
    if (children && children.length) {
      return [item, ...getTreeFlatList(children, childrenKey)]
    }
    return [item]
  })
}

/**
 * 从树中找到指定 id 的节点路径
 * @param tree 树数据
 * @param id   要查找的 id
 */
export function getCurrentNodeTree<T extends { id?: number, children?: T[] }>(
  tree: T[],
  id: number,
): T[] | null {
  for (const item of tree) {
    if (item.id === id) {
      return [item]
    }
    if (item.children) {
      const found = getCurrentNodeTree(item.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

/**
 * 在树中找到指定 id 的节点
 * @param tree 树数据
 * @param id   要查找的 id
 * @returns    找到的节点对象，未找到返回 null
 */
export function findNodeById<T extends { id?: number, children?: T[] }>(
  tree: T[],
  id: number,
): T | null {
  const stack: T[] = [...tree]
  while (stack.length > 0) {
    const node = stack.pop()!
    if (node.id === id) {
      return node
    }
    if (node.children && node.children.length) {
      stack.push(...node.children)
    }
  }
  return null
}
