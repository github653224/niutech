// 本地发布服务：登录后用 Markdown 编辑器写文章，一键 commit + push 到 GitHub
import express from 'express';
import session from 'express-session';
import simpleGit from 'simple-git';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts');

if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

const PORT = process.env.PUBLISHER_PORT || 4399;
const PASSWORD = process.env.PUBLISHER_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomUUID();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

app.use(express.static(path.join(__dirname, 'public')));

// 所有 /api 响应禁用缓存，确保前端拖拽/置顶后拿到最新数据
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.get('/', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/editor.html');
  res.redirect('/login.html');
});

function auth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: '未登录' });
}

app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (password === PASSWORD) {
    req.session.user = { name: 'admin' };
    return res.json({ ok: true });
  }
  res.status(401).json({ error: '密码错误' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/me', (req, res) => {
  res.json({ user: req.session?.user || null });
});

// 列出文章
app.get('/api/posts', auth, (req, res) => {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const posts = files
    .map((f) => {
      const content = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8');
      const { data } = parseFrontmatter(content);
      return { slug: f.replace(/\.md$/, ''), filename: f, ...data };
    })
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  res.json({ posts });
});

// 读取单篇
app.get('/api/posts/:slug', auth, (req, res) => {
  const file = path.join(POSTS_DIR, `${req.params.slug}.md`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: '不存在' });
  const content = fs.readFileSync(file, 'utf-8');
  const { data, body } = parseFrontmatter(content);
  res.json({ slug: req.params.slug, ...data, body });
});

// 发布 / 更新
app.post('/api/publish', auth, async (req, res) => {
  try {
    const { title, description, tags, pubDate, body, slug: customSlug, originalSlug, category, pinned } = req.body;
    if (!title || !body) return res.status(400).json({ error: '标题和正文不能为空' });

    const date = pubDate || new Date().toISOString().slice(0, 10);
    const slug = customSlug || generateSlug(title, date);
    const filename = `${slug}.md`;
    const filepath = path.join(POSTS_DIR, filename);

    if (originalSlug && originalSlug !== slug) {
      const oldFile = path.join(POSTS_DIR, `${originalSlug}.md`);
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }

    const tagsArray = parseTagsInput(tags);
    const fm = buildFrontmatter({ title, description, tags: tagsArray, pubDate: date, category, pinned });
    fs.writeFileSync(filepath, fm + body.trim() + '\n', 'utf-8');

    const git = simpleGit(ROOT);
    await git.add('.');
    const commitMsg = originalSlug ? `update: ${title}` : `publish: ${title}`;
    await git.commit(commitMsg);

    let pushed = false;
    let pushError = null;
    let hasRemote = true;
    try {
      const remotes = await git.getRemotes(true);
      if (!remotes.length) {
        hasRemote = false;
        pushError = '仓库未配置 remote，文章已保存并提交到本地。请添加 remote 后手动 push。';
      } else {
        await git.push();
        pushed = true;
      }
    } catch (e) {
      pushError = e.message;
    }

    res.json({ ok: true, slug, pushed, hasRemote, pushError });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 删除
app.post('/api/delete', auth, async (req, res) => {
  try {
    const { slug } = req.body;
    const file = path.join(POSTS_DIR, `${slug}.md`);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      const git = simpleGit(ROOT);
      await git.add('.');
      await git.commit(`delete: ${slug}`);
      try {
        await git.push();
      } catch (e) {}
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 批量更新分类（拖拽改文件夹时用）
app.post('/api/set-category', auth, async (req, res) => {
  try {
    const { slug, category } = req.body;
    const file = path.join(POSTS_DIR, `${slug}.md`);
    if (!fs.existsSync(file)) return res.status(404).json({ error: '不存在' });
    const content = fs.readFileSync(file, 'utf-8');
    const { data, body } = parseFrontmatter(content);
    if (category) data.category = category;
    else delete data.category;
    const fm = buildFrontmatter({ ...data, tags: data.tags || [] });
    fs.writeFileSync(file, fm + body.trim() + '\n', 'utf-8');
    const git = simpleGit(ROOT);
    await git.add('.');
    await git.commit(`category: ${slug} -> ${category || '未分类'}`);
    try { await git.push(); } catch (e) {}
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 置顶/取消置顶
app.post('/api/set-pin', auth, async (req, res) => {
  try {
    const { slug, pinned } = req.body;
    const file = path.join(POSTS_DIR, `${slug}.md`);
    if (!fs.existsSync(file)) return res.status(404).json({ error: '不存在' });
    const content = fs.readFileSync(file, 'utf-8');
    const { data, body } = parseFrontmatter(content);
    if (pinned) data.pinned = true;
    else delete data.pinned;
    const fm = buildFrontmatter({ ...data, tags: data.tags || [] });
    fs.writeFileSync(file, fm + body.trim() + '\n', 'utf-8');
    const git = simpleGit(ROOT);
    await git.add('.');
    await git.commit(`pin: ${slug} -> ${pinned ? '置顶' : '取消'}`);
    try { await git.push(); } catch (e) {}
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  发布服务已启动: http://localhost:${PORT}`);
  console.log(`  登录密码: ${PASSWORD === 'admin123' ? 'admin123（默认，请修改 .env）' : '已自定义'}`);
  console.log(`  文章目录: ${POSTS_DIR}\n`);
});

// ---------- 辅助函数 ----------
// 健壮的 frontmatter 解析：支持多行数组、行内数组、字符串
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  const fmStr = match[1];
  const body = match[2];
  const data = {};
  const lines = fmStr.split(/\r?\n/);
  let currentArray = null;
  for (const line of lines) {
    // 多行数组项: "  - 'value'" 或 "  - value"
    const arrMatch = line.match(/^\s+-\s+(.*)$/);
    if (arrMatch && currentArray) {
      currentArray.push(stripQuotes(arrMatch[1]));
      continue;
    }
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) {
      currentArray = null;
      const key = m[1];
      let val = m[2].trim();
      if (val === '') {
        // 空值，可能下面是多行数组
        currentArray = [];
        data[key] = currentArray;
      } else if (val === '[]') {
        // 空行内数组
        data[key] = [];
      } else if (val.startsWith('[') && val.endsWith(']')) {
        // 行内数组: ['a', 'b'] 或 ["a", "b"]
        const inner = val.slice(1, -1).trim();
        if (inner) {
          data[key] = inner.split(',').map((s) => stripQuotes(s.trim())).filter((s) => s !== '');
        } else {
          data[key] = [];
        }
      } else if (key === 'draft' || key === 'pinned') {
        data[key] = val === 'true';
      } else {
        data[key] = stripQuotes(val);
      }
    }
  }
  // 规范化 tags 为数组
  if (data.tags && !Array.isArray(data.tags)) {
    data.tags = [String(data.tags)];
  }
  if (!data.tags) data.tags = [];
  return { data, body };
}

function stripQuotes(s) {
  s = s.trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1);
  }
  return s;
}

// 把用户输入的标签字符串解析成数组
function parseTagsInput(tags) {
  if (Array.isArray(tags)) return tags;
  if (!tags) return [];
  return String(tags)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildFrontmatter({ title, description, tags, pubDate, category, pinned }) {
  let fm = '---\n';
  fm += `title: ${JSON.stringify(title || '')}\n`;
  fm += `description: ${JSON.stringify(description || '')}\n`;
  fm += `pubDate: ${pubDate || new Date().toISOString().slice(0, 10)}\n`;
  if (tags && tags.length) {
    fm += 'tags:\n';
    tags.forEach((t) => (fm += `  - ${JSON.stringify(t)}\n`));
  } else {
    fm += 'tags: []\n';
  }
  if (category) {
    fm += `category: ${JSON.stringify(category)}\n`;
  }
  if (pinned) {
    fm += `pinned: true\n`;
  }
  fm += 'draft: false\n';
  fm += '---\n\n';
  return fm;
}

function generateSlug(title, pubDate) {
  const d = pubDate ? new Date(pubDate) : new Date();
  const date = typeof d === 'string' ? d.slice(0, 10) : d.toISOString().slice(0, 10);
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const rand = crypto.randomBytes(3).toString('hex');
  return ascii ? `${date}-${ascii.slice(0, 40)}` : `${date}-${rand}`;
}
