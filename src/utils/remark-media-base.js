// remark 插件：给 Markdown 中的 /media/ 路径加上 Astro base 前缀
// 解决部署在子路径（如 /niutech/）时媒体文件路径不对的问题
export function remarkMediaBaseUrl(options) {
  const base = options.base || '';
  const data = this.data();
  return (tree) => {
    if (!base || base === '/') return;
    visit(tree, (node) => {
      if (node.type === 'image' || node.type === 'link') {
        if (node.url && node.url.startsWith('/media/')) {
          node.url = base + node.url;
        }
      }
      // 处理 HTML 节点中的 src/srcset 属性（video/audio 标签）
      if (node.type === 'html') {
        node.value = node.value.replace(
          /((?:src|href)\s*=\s*["'])(\/media\/)/g,
          `$1${base}$2`
        );
      }
    });
  };
}

// 简易 visit：遍历 mdast 树
function visit(tree, visitor) {
  if (!tree || !tree.children) return;
  const walk = (node) => {
    visitor(node);
    if (node.children) {
      node.children.forEach(walk);
    }
  };
  tree.children.forEach(walk);
}
