// 发布台前端逻辑
let currentSlug = null;
let originalSlug = null;
let allPosts = [];
let folders = []; // 文件夹列表（独立维护，即使空也显示）

const THEME_KEY = 'publisher-theme';
const FOLDERS_KEY = 'publisher-folders';
function applyTheme(t) {
  document.body.className = t === 'light' ? 'theme-light' : 'theme-dark';
  document.getElementById('theme-toggle').textContent = t === 'light' ? '☀️' : '🌙';
}
function toggleTheme() {
  const cur = localStorage.getItem(THEME_KEY) || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}
applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

// 文件夹列表：localStorage 持久化 + 从文章自动补充
function loadFolders() {
  try {
    folders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '[]');
  } catch (e) {
    folders = [];
  }
}
function saveFolders() {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}
// 把文章里的 category 合并进 folders（不持久化这些自动补充的，除非用户新建）
function getEffectiveFolders() {
  const set = new Set(folders);
  allPosts.forEach((p) => {
    if (p.category) set.add(p.category);
  });
  return [...set].sort((a, b) => a.localeCompare(b, 'zh'));
}

async function checkAuth() {
  const r = await fetch('/api/me');
  const data = await r.json();
  if (!data.user) {
    location.href = '/login.html';
    return false;
  }
  return true;
}

async function loadList() {
  const r = await fetch('/api/posts');
  const data = await r.json();
  allPosts = data.posts || [];
  updateCategoryDatalist();
  renderList();
}

function updateCategoryDatalist() {
  const dl = document.getElementById('category-list');
  dl.innerHTML = getEffectiveFolders().map((c) => '<option value="' + escapeAttr(c) + '">').join('');
}

function renderList() {
  const list = document.getElementById('post-list');
  const q = (document.getElementById('search').value || '').trim().toLowerCase();

  let posts = allPosts;
  if (q) {
    posts = posts.filter((p) => (p.title || '').toLowerCase().includes(q));
  }

  list.innerHTML = '';

  // 所有文件夹（包括空文件夹）
  const allFolders = getEffectiveFolders();
  // 按文章分组
  const folderMap = {};
  allFolders.forEach((f) => (folderMap[f] = []));
  posts.forEach((p) => {
    const cat = p.category || '';
    const key = cat || '未分类';
    if (!folderMap[key]) folderMap[key] = [];
    folderMap[key].push(p);
  });
  // 未分类
  if (!folderMap['未分类']) folderMap['未分类'] = [];
  posts.filter((p) => !p.category).forEach((p) => folderMap['未分类'].push(p));

  // 排序：未分类放最后
  const folderNames = Object.keys(folderMap).sort((a, b) => {
    if (a === '未分类') return 1;
    if (b === '未分类') return -1;
    return a.localeCompare(b, 'zh');
  });

  if (!folderNames.length && !q) {
    list.innerHTML = '<p class="empty">还没有文章，点「新建文章」开始</p>';
    return;
  }

  folderNames.forEach((folder) => {
    const items = folderMap[folder] || [];
    const isUncategorized = folder === '未分类';
    const group = document.createElement('div');
    group.className = 'folder-group';

    const head = document.createElement('div');
    head.className = 'folder-group-head';
    head.innerHTML =
      '<span class="arrow">▼</span>' +
      '<span class="folder-icon">' + (isUncategorized ? '📄' : '📁') + '</span>' +
      '<span class="name" title="' + escapeAttr(folder) + '">' + escapeHtml(folder) + '</span>' +
      '<span class="count">' + items.length + '</span>' +
      (isUncategorized ? '' : '<button class="folder-action rename" title="重命名文件夹">✎</button><button class="folder-action del" title="删除文件夹">✕</button>');

    // 折叠/展开
    head.addEventListener('click', (e) => {
      if (e.target.closest('.folder-action')) return;
      group.classList.toggle('collapsed');
    });

    // 重命名
    const renameBtn = head.querySelector('.folder-action.rename');
    if (renameBtn) {
      renameBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renameFolder(folder, items);
      });
    }
    // 删除空文件夹
    const delBtn = head.querySelector('.folder-action.del');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteFolder(folder, items);
      });
    }

    const itemsEl = document.createElement('div');
    itemsEl.className = 'folder-items';

    if (!items.length) {
      itemsEl.innerHTML = '<p class="empty-sub">空文件夹</p>';
    } else {
      items.forEach((p) => {
        const item = document.createElement('div');
        item.className = 'post-item';
        if (p.slug === currentSlug) item.classList.add('active');
        item.innerHTML =
          '<div class="pi-title">' + escapeHtml(p.title) + '</div>' +
          '<div class="pi-date">' + (p.pubDate ? String(p.pubDate).slice(0, 10) : '') + '</div>';
        item.addEventListener('click', () => loadPost(p.slug));
        itemsEl.appendChild(item);
      });
    }

    group.appendChild(head);
    group.appendChild(itemsEl);
    list.appendChild(group);
  });
}

async function loadPost(slug) {
  const r = await fetch('/api/posts/' + slug);
  if (!r.ok) return;
  const data = await r.json();
  currentSlug = slug;
  originalSlug = slug;
  document.getElementById('title').value = data.title || '';
  document.getElementById('slug').value = slug;
  document.getElementById('description').value = data.description || '';
  document.getElementById('tags').value = (Array.isArray(data.tags) ? data.tags : []).join(', ');
  document.getElementById('pubDate').value = (data.pubDate || '').slice(0, 10);
  document.getElementById('category').value = data.category || '';
  document.getElementById('body').value = data.body || '';
  updatePreview();
  renderList();
}

function newPost() {
  currentSlug = null;
  originalSlug = null;
  document.getElementById('title').value = '';
  document.getElementById('slug').value = '';
  document.getElementById('description').value = '';
  document.getElementById('tags').value = '';
  document.getElementById('category').value = '';
  document.getElementById('pubDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('body').value = '';
  updatePreview();
  renderList();
  document.getElementById('title').focus();
}

function updatePreview() {
  const body = document.getElementById('body').value;
  document.getElementById('preview').innerHTML = marked.parse(body || '*预览区为空*');
}

async function publish() {
  const title = document.getElementById('title').value.trim();
  const body = document.getElementById('body').value;
  if (!title) return showStatus('请填写标题', 'error');
  if (!body.trim()) return showStatus('正文不能为空', 'error');

  const btn = document.getElementById('publish-btn');
  btn.disabled = true;
  btn.textContent = '发布中…';
  showStatus('正在写入并推送到 GitHub…', 'info');

  try {
    const r = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description: document.getElementById('description').value.trim(),
        tags: document.getElementById('tags').value,
        pubDate: document.getElementById('pubDate').value,
        body,
        slug: document.getElementById('slug').value.trim() || undefined,
        originalSlug,
        category: document.getElementById('category').value.trim(),
      }),
    });
    const data = await r.json();
    if (r.ok && data.ok) {
      currentSlug = data.slug;
      originalSlug = data.slug;
      document.getElementById('slug').value = data.slug;
      // 如果文章用了新文件夹，加到 folders 列表
      const cat = document.getElementById('category').value.trim();
      if (cat && !folders.includes(cat)) {
        folders.push(cat);
        saveFolders();
      }
      if (data.pushed) {
        showStatus('发布成功！GitHub Actions 将自动构建部署。slug: ' + data.slug, 'success');
      } else if (data.hasRemote === false) {
        showStatus('已提交到本地，但未配置 remote。slug: ' + data.slug, 'warn');
      } else {
        showStatus('已提交，但 push 失败：' + data.pushError + '。slug: ' + data.slug, 'warn');
      }
      loadList();
    } else {
      showStatus(data.error || '发布失败', 'error');
    }
  } catch (e) {
    showStatus('网络错误：' + e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '发布到 GitHub';
  }
}

function showStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = 'status ' + type;
  el.hidden = false;
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(s) {
  return String(s || '').replace(/"/g, '&quot;');
}

// 新建文件夹
function newFolder() {
  const name = prompt('输入文件夹名称：');
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  if (folders.includes(trimmed) || trimmed === '未分类') {
    showStatus('文件夹「' + trimmed + '」已存在', 'warn');
    return;
  }
  folders.push(trimmed);
  saveFolders();
  updateCategoryDatalist();
  renderList();
  showStatus('文件夹「' + trimmed + '」已创建。编辑文章时在「文件夹」字段填入该名称即可归类。', 'success');
}

// 重命名文件夹（更新 localStorage + 批量更新文章 category）
async function renameFolder(oldName, items) {
  const newName = prompt('将文件夹「' + oldName + '」重命名为：', oldName);
  if (!newName) return;
  const trimmed = newName.trim();
  if (!trimmed || trimmed === oldName) return;
  if (folders.includes(trimmed) || trimmed === '未分类') {
    showStatus('文件夹「' + trimmed + '」已存在', 'warn');
    return;
  }

  showStatus('正在重命名文件夹…', 'info');
  let ok = 0, fail = 0;
  for (const p of items) {
    try {
      const r = await fetch('/api/set-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: p.slug, category: trimmed }),
      });
      if (r.ok) ok++;
      else fail++;
    } catch (e) {
      fail++;
    }
  }
  // 更新 localStorage
  const idx = folders.indexOf(oldName);
  if (idx >= 0) {
    folders[idx] = trimmed;
    saveFolders();
  }
  await loadList();
  showStatus(
    '文件夹已重命名为「' + trimmed + '」' + (ok ? '，' + ok + ' 篇文章已更新' : '') + (fail ? '，' + fail + ' 篇失败' : ''),
    fail ? 'warn' : 'success'
  );
}

// 删除文件夹（空文件夹直接删，有文章的需确认是否移到未分类）
async function deleteFolder(name, items) {
  if (items.length > 0) {
    if (!confirm('文件夹「' + name + '」下有 ' + items.length + ' 篇文章。删除文件夹后这些文章将变为「未分类」。确认删除？')) return;
    showStatus('正在移动文章到未分类…', 'info');
    for (const p of items) {
      try {
        await fetch('/api/set-category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: p.slug, category: '' }),
        });
      } catch (e) {}
    }
  } else {
    if (!confirm('删除空文件夹「' + name + '」？')) return;
  }
  const idx = folders.indexOf(name);
  if (idx >= 0) {
    folders.splice(idx, 1);
    saveFolders();
  }
  await loadList();
  showStatus('文件夹「' + name + '」已删除', 'success');
}

function setViewMode(mode) {
  const body = document.getElementById('editor-body');
  body.dataset.mode = mode;
  document.querySelectorAll('.view-switch button').forEach((b) => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
}

function initDivider() {
  const divider = document.getElementById('divider');
  const container = document.getElementById('editor-body');
  let dragging = false;

  const onMove = (clientX) => {
    if (!dragging) return;
    const rect = container.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(15, Math.min(85, pct));
    container.style.gridTemplateColumns = pct + '% 6px ' + (100 - pct) + '%';
  };

  divider.addEventListener('mousedown', (e) => {
    dragging = true;
    divider.classList.add('dragging');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => onMove(e.clientX));
  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      divider.classList.remove('dragging');
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  });
  divider.addEventListener('touchstart', (e) => {
    dragging = true;
    divider.classList.add('dragging');
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', (e) => {
    if (dragging && e.touches[0]) onMove(e.touches[0].clientX);
  });
  document.addEventListener('touchend', () => {
    if (dragging) {
      dragging = false;
      divider.classList.remove('dragging');
    }
  });
}

(async () => {
  if (!(await checkAuth())) return;
  loadFolders();
  document.getElementById('new-btn').onclick = newPost;
  document.getElementById('new-folder-btn').onclick = newFolder;
  document.getElementById('publish-btn').onclick = publish;
  document.getElementById('logout-btn').onclick = async () => {
    await fetch('/api/logout', { method: 'POST' });
    location.href = '/login.html';
  };
  document.getElementById('theme-toggle').onclick = toggleTheme;
  document.getElementById('search').addEventListener('input', renderList);
  document.getElementById('body').addEventListener('input', updatePreview);
  document.querySelectorAll('.view-switch button').forEach((b) => {
    b.onclick = () => setViewMode(b.dataset.mode);
  });
  initDivider();
  await loadList();
  newPost();
})();
