/**
 * 将平铺的数组数据转换为树结构
 *
 * @template T - 节点数据的类型
 * @param data - 原始数组数据
 * @param id - 节点 ID 字段名（默认为 "id"）
 * @param parentId - 父节点 ID 字段名（默认为 "parentId"）
 * @param children - 子节点字段名（默认为 "children"）
 * @returns 树形结构数组
 *
 * @example
 * const data = [
 *   { id: 1, parentId: 0, name: '根节点1' },
 *   { id: 2, parentId: 1, name: '子节点1-1' },
 *   { id: 3, parentId: 1, name: '子节点1-2' },
 *   { id: 4, parentId: 2, name: '子节点1-1-1' },
 *   { id: 5, parentId: 0, name: '根节点2' }
 * ]
 *
 * const tree = handleTree(data)
 * // [
 * //   { id:1, parentId:0, name:'根节点1', children:[...] },
 * //   { id:5, parentId:0, name:'根节点2', children:[] }
 * // ]
 */
export function handleTree<T extends Record<string, any>>(
  data: T[],
  id: keyof T = 'id' as keyof T,
  parentId: keyof T = 'parentId' as keyof T,
  children: string = 'children',
): T[] {
  // 配置字段名
  const config = {
    id,
    parentId,
    childrenList: children,
  }

  // parentId -> 子节点映射
  const childrenListMap: Record<string, T[]> = {}

  // 保存所有节点，方便后续判断根节点
  const nodeIds: Record<string, T> = {}

  // 最终的树形结构数组
  const tree: T[] = []

  // 第一次循环：根据 parentId 分组
  for (const d of data) {
    const parentKey = String(d[config.parentId]) // 转成字符串避免 key 冲突
    if (!childrenListMap[parentKey]) {
      childrenListMap[parentKey] = []
    }
    nodeIds[String(d[config.id])] = d
    childrenListMap[parentKey].push(d)
  }

  // 第二次循环：找到根节点（即 parentId 不在 nodeIds 中的节点）
  for (const d of data) {
    const parentKey = String(d[config.parentId])
    if (!nodeIds[parentKey]) {
      tree.push(d)
    }
  }

  // 递归组装子节点
  const adaptToChildrenList = (node: T) => {
    const nodeId = String(node[config.id])
    if (childrenListMap[nodeId]) {
      (node as any)[config.childrenList] = childrenListMap[nodeId]
    }
    if ((node as any)[config.childrenList]) {
      for (const child of (node as any)[config.childrenList]) {
        adaptToChildrenList(child)
      }
    }
  }

  // 遍历根节点，递归组装
  for (const t of tree) {
    adaptToChildrenList(t)
  }

  return tree
}
// ✅ 自描述的树节点类型，支持任意子节点键名 K（默认可用 'children'）
export type Node<K extends PropertyKey = 'children'> = {
  isDisabled?: boolean
} & {
  [P in K]?: Node<K>[]
} & Record<string, unknown>

/**
 * 不修改原数据，返回新树
 * @param tree 树
 * @param disabledLevels 需要禁用的层级，如 [1, 2]
 * @param childKey 子节点键名，如 'children' | 'nodes'
 */
export function markDisabledLevels<K extends PropertyKey>(
  tree: Node<K>[],
  disabledLevels: number[],
  childKey: K,
): Node<K>[] {
  const levelSet = new Set<number>(disabledLevels)
  const walk = (nodes: Node<K>[], depth: number): Node<K>[] => {
    return nodes.map((n) => {
      const copy: Node<K> = { ...n }
      copy.isDisabled = levelSet.has(depth)
      const kids = copy[childKey]
      if (Array.isArray(kids) && kids.length > 0) {
        const next = walk(kids, depth + 1)
          ; (copy as Record<K, Node<K>[] | undefined>)[childKey] = next
      }
      return copy
    })
  }
  return walk(tree, 1)
}

/**
 * 就地修改版：直接改传入的 tree
 */
export function markDisabledLevelsInPlace<K extends PropertyKey>(
  tree: Node<K>[],
  disabledLevels: number[],
  childKey: K,
): void {
  const levelSet = new Set<number>(disabledLevels)
  const dfs = (nodes: Node<K>[], depth: number): void => {
    for (const node of nodes) {
      node.isDisabled = levelSet.has(depth)
      const kids = node[childKey]
      if (Array.isArray(kids) && kids.length > 0) {
        dfs(kids, depth + 1)
      }
    }
  }
  dfs(tree, 1)
}

// 🚀 如果你的树就是 { children?: Node[] }，可以用便捷封装
export type ChildrenNode = Node<'children'>

export function markDisabledLevelsChildren(
  tree: ChildrenNode[],
  disabledLevels: number[],
): ChildrenNode[] {
  return markDisabledLevels(tree, disabledLevels, 'children')
}

export function markDisabledLevelsChildrenInPlace(
  tree: ChildrenNode[],
  disabledLevels: number[],
): void {
  markDisabledLevelsInPlace(tree, disabledLevels, 'children')
}
