# 热爱技术的小牛 · 个人技术博客

测试开发工程师的个人技术博客，聚焦测试提效、AI 提效、AI SaaS 项目实战。

## 功能

- 文章列表 / 文章详情 / 标签分类 / 关于页面
- Markdown 渲染 + 代码高亮（Shiki）
- 深色 / 浅色主题切换（自动跟随系统 + 手动切换并持久化）
- GitHub Pages 自动部署（push 到 main 触发 GitHub Actions）
- 本地发布台：浏览器登录后用 Markdown 编辑器写文章，一键发布到 GitHub

## 技术栈

- **博客主体**：[Astro](https://astro.build/) + Tailwind CSS（静态站点生成，SEO 友好）
- **内容**：Markdown 文件存于 `src/content/posts/`，Git 即数据库
- **发布服务**：Node + Express（本地运行，登录 + 编辑器 + 一键 git push）
- **部署**：GitHub Actions → GitHub Pages

## 快速开始

```bash
# 安装依赖
npm install

# 本地预览博客
npm run dev
# 打开 http://localhost:4321/niutech/
```

## 发布文章

### 1. 配置发布服务密码

```bash
cp publisher/.env.example publisher/.env
# 编辑 publisher/.env，修改 PUBLISHER_PASSWORD
```

### 2. 启动发布台

```bash
npm run publisher
# 打开 http://localhost:4399 ，输入密码登录
```

### 3. 写文章并发布

- 左侧点「+ 新建文章」
- 填写标题、描述、标签、日期
- 右侧 Markdown 编辑器写正文（左侧编辑、右侧实时预览）
- 点「发布到 GitHub」→ 自动写入 `.md` 文件 + commit + push
- GitHub Actions 自动构建并部署到 GitHub Pages

> 发布前需确保仓库已配置 remote 并能 push（见下文部署配置）。

## 部署到 GitHub Pages

### 1. 创建仓库并推送

```bash
git remote add origin git@github.com:<你的用户名>/niutech.git
git push -u origin main
```

### 2. 修改站点配置

编辑 `astro.config.mjs`，把 `site` 和 `base` 改成你的地址：

- 项目站点（`https://<用户名>.github.io/niutech/`）：
  - `site: 'https://<用户名>.github.io'`
  - `base: '/niutech'`
- 用户根站点（仓库名为 `<用户名>.github.io`）：
  - `site: 'https://<用户名>.github.io'`
  - `base: '/'`

同时把 `src/consts.ts` 里的 GitHub 链接、`src/pages/about.astro` 的内容改成你的。

### 3. 开启 GitHub Pages

仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

推送代码后，`.github/workflows/deploy.yml` 会自动构建并部署。访问地址见 Actions 运行结果的 URL。

## 目录结构

```
niutech/
├── src/
│   ├── content/
│   │   ├── config.ts          # 文章 schema
│   │   └── posts/             # Markdown 文章
│   ├── pages/                 # 页面路由
│   │   ├── index.astro        # 首页（文章列表）
│   │   ├── about.astro        # 关于
│   │   ├── posts/[...slug].astro  # 文章详情
│   │   └── tags/              # 标签页
│   ├── components/            # 组件
│   ├── layouts/               # 布局
│   ├── styles/global.css      # 全局样式
│   └── consts.ts              # 站点配置
├── publisher/                 # 本地发布服务
│   ├── server.js
│   ├── public/                # 发布台前端
│   └── .env.example
├── .github/workflows/deploy.yml  # 自动部署
├── astro.config.mjs
└── package.json
```

## 文章 Frontmatter

```markdown
---
title: '文章标题'
description: '一句话描述'
pubDate: 2026-07-01
tags: ['测试提效', 'AI 提效']
draft: false        # true 则不发布
---

正文内容（Markdown）…
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地预览博客 |
| `npm run build` | 构建静态站点到 dist/ |
| `npm run publisher` | 启动本地发布台（http://localhost:4399） |
