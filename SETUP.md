# 换电脑配置指南

在新电脑上从零开始使用发布台写文章并推送到 GitHub 的完整步骤。

---

## 1. 安装基础环境

### Node.js（必需，18+）

```bash
# macOS（推荐用 Homebrew）
brew install node@22

# 或去官网下载安装包
# https://nodejs.org/
```

验证：

```bash
node -v   # 应输出 v18 或更高
npm -v
```

### Git（必需）

macOS 装好 Xcode Command Line Tools 就自带：

```bash
xcode-select --install
git --version
```

### GitHub CLI（推荐，用来一键配置 git push 认证）

```bash
brew install gh
gh --version
```

---

## 2. 拉取博客仓库

```bash
cd ~/Documents   # 或你想放的目录
git clone https://github.com/github653224/niutech.git
cd niutech
```

---

## 3. 配置 Git 推送认证（关键）

发布台点「发布到 GitHub」时会自动 `git push`，需要本机能免密 push。**三选一**：

### 方式 A：GitHub CLI 登录（最简单，推荐）

```bash
gh auth login
```

按提示选 GitHub.com → HTTPS → 用浏览器登录。完成后 git push 自动走 gh 的凭证，无需额外配置。

> 验证：`gh auth status` 显示 ✓ Logged in 即可。

### 方式 B：SSH Key

```bash
# 1. 生成密钥
ssh-keygen -t ed25519 -C "你的邮箱"
# 一路回车

# 2. 复制公钥
pbcopy < ~/.ssh/id_ed25519.pub

# 3. 到 GitHub → Settings → SSH and GPG keys → New SSH key → 粘贴

# 4. 改 remote 为 SSH
git remote set-url origin git@github.com:github653224/niutech.git

# 5. 验证
ssh -T git@github.com
```

### 方式 C：Personal Access Token（HTTPS）

1. GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. 勾选 `repo` 权限，生成后复制 token
3. 第一次 push 时输入用户名和 token（不是密码），选保存凭证

---

## 4. 安装项目依赖

```bash
npm install
```

---

## 5. 配置发布台密码

```bash
cp publisher/.env.example publisher/.env
```

编辑 `publisher/.env`：

```
PUBLISHER_PASSWORD=你的密码
```

> 换电脑后密码可以不一致，只是本地登录用。但保持一致方便记忆。

---

## 6. 启动发布台

```bash
npm run publisher
```

打开 http://localhost:4399 ，输入密码登录，即可写文章发布。

---

## 快速检查清单

换好电脑后，按这个清单逐项确认：

- [ ] Node.js 已安装（`node -v` ≥ 18）
- [ ] Git 已安装（`git --version`）
- [ ] 仓库已 clone（`git clone ...`）
- [ ] Git push 认证已配置（`gh auth login` / SSH key / PAT）
- [ ] 免密 push 测试通过（`git push` 不提示输密码）
- [ ] 依赖已安装（`npm install`）
- [ ] 发布台密码已配置（`publisher/.env`）
- [ ] 发布台能启动（`npm run publisher`）
- [ ] 能登录并写一篇文章测试发布

---

## 常见问题

### Q: 发布时报 "git push 失败 / permission denied"

git 认证没配好。优先用 `gh auth login`，最省事。

### Q: 启动报 "Cannot find module 'express'"

依赖没装，跑一次 `npm install`。

### Q: 启动报端口被占用

```bash
lsof -ti:4399 | xargs kill -9
npm run publisher
```

### Q: 想同时预览博客效果

```bash
npm run dev        # 博客预览 http://localhost:4321/niutech/
npm run publisher  # 发布台 http://localhost:4399 （另开一个终端）
```

### Q: 文章发布后线上没更新

GitHub Actions 构建需要 1-2 分钟。去仓库的 Actions 页面看进度：
https://github.com/github653224/niutech/actions
