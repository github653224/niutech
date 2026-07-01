# agni-site 项目长期记忆

## 项目定位
博主「热爱技术的小牛」的个人技术博客。博主是测试开发工程师，内容方向：测试提效工具、AI 提效工具、AI SaaS 项目实战。

## 技术栈
- 博客主体：Astro 4 + Tailwind CSS 3（静态站点生成）
- 内容：Markdown 文件存 `src/content/posts/`，Astro Content Collections 管理
- 发布服务：本地 Node + Express（`publisher/`），登录后 Markdown 编辑器一键 commit+push
- 部署：GitHub Actions → GitHub Pages

## 关键配置
- `astro.config.mjs`：site/base 需按用户 GitHub 地址配置（当前占位 yourusername）
- base 默认 `/agni-site`（项目站点）
- 发布服务端口 4399，密码在 `publisher/.env` 的 PUBLISHER_PASSWORD
- 构建需环境变量 `ASTRO_TELEMETRY_DISABLED=1`（沙箱拦截遥测写 Library/Preferences）

## 命令
- `npm run dev`：本地预览博客（http://localhost:4321/agni-site）
- `npm run build`：构建到 dist/
- `npm run publisher`：启动发布台（http://localhost:4399）

## 发布流程
1. `npm run publisher` 启动发布台
2. 浏览器登录 → Markdown 编辑器写文章 → 点「发布到 GitHub」
3. 自动写 .md + git commit + push → GitHub Actions 自动构建部署

## 博主相关项目
- /Users/rock/Documents/ai-test-agent：PR/MR 驱动的 AI 自动化测试平台（FastAPI+React+Celery），博客示例文章参考了该项目
