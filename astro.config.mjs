// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// ====== GitHub Pages 部署配置 ======
// 1) 如果部署到 https://<用户名>.github.io/<仓库名>/ 这种项目站点：
//    site = 'https://<用户名>.github.io'
//    base = '/<仓库名>'
// 2) 如果部署到 https://<用户名>.github.io/ 这种用户根站点（仓库名为 <用户名>.github.io）：
//    site = 'https://<用户名>.github.io'
//    base = '/'
// 请把 yourusername 替换为你的 GitHub 用户名。
export default defineConfig({
  site: 'https://github653224.github.io',
  base: '/niutech',
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
