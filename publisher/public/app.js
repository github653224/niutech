// 发布台前端逻辑
let currentSlug = null;
let originalSlug = null;
let allPosts = [];
let folders = [];
let draggingSlug = null;
let allMedia = { images: [], audio: [], video: [] };

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

function loadFolders() {
  try { folders = JSON.parse(localStorage.getItem(FOLDERS_KEY) || '[]'); } catch (e) { folders = []; }
}
function saveFolders() { localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders)); }
function getEffectiveFolders() {
  const set = new Set(folders);
  allPosts.forEach((p) => { if (p.category) set.add(p.category); });
  return [...set].sort((a, b) => a.localeCompare(b, 'zh'));
}

async function checkAuth() {
  const r = await fetch('/api/me');
  const data = await r.json();
  if (!data.user) { location.href = '/login.html'; return false; }
  return true;
}

// ==================== 文章管理 ====================

async function loadList() {
  const r = await fetch('/api/posts', { cache: 'no-store' });
  const data = await r.json();
  allPosts = data.posts || [];
  if (currentSlug) {
    const cur = allPosts.find((p) => p.slug === currentSlug);
    if (cur) {
      document.getElementById('category').value = cur.category || '';
      document.getElementById('pin-toggle').checked = !!cur.pinned;
    }
  }
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
  if (q) posts = posts.filter((p) => (p.title || '').toLowerCase().includes(q));

  list.innerHTML = '';
  const folderMap = {};
  posts.forEach((p) => {
    const key = p.category || '未分类';
    if (!folderMap[key]) folderMap[key] = [];
    folderMap[key].push(p);
  });
  getEffectiveFolders().forEach((f) => { if (!folderMap[f]) folderMap[f] = []; });
  if (!folderMap['未分类']) folderMap['未分类'] = [];

  const folderNames = Object.keys(folderMap).sort((a, b) => {
    if (a === '未分类') return 1;
    if (b === '未分类') return -1;
    return a.localeCompare(b, 'zh');
  });

  if (!posts.length && !q) {
    list.innerHTML = '<p class="empty">还没有文章，点「新建文章」开始</p>';
    return;
  }

  folderNames.forEach((folder) => {
    const items = folderMap[folder] || [];
    items.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    const isUncat = folder === '未分类';
    const group = document.createElement('div');
    group.className = 'folder-group';

    const head = document.createElement('div');
    head.className = 'folder-group-head drop-target';
    head.dataset.folder = folder;
    head.innerHTML =
      '<span class="arrow">▼</span>' +
      '<span class="folder-icon">' + (isUncat ? '📄' : '📁') + '</span>' +
      '<span class="name" title="' + escapeAttr(folder) + '">' + escapeHtml(folder) + '</span>' +
      '<span class="count">' + items.length + '</span>' +
      (isUncat ? '' : '<button class="folder-action rename" title="重命名">✎</button><button class="folder-action del" title="删除">✕</button>');

    head.addEventListener('click', (e) => {
      if (e.target.closest('.folder-action')) return;
      group.classList.toggle('collapsed');
    });
    head.addEventListener('dragover', (e) => { e.preventDefault(); head.classList.add('drag-over'); });
    head.addEventListener('dragleave', () => head.classList.remove('drag-over'));
    head.addEventListener('drop', async (e) => {
      e.preventDefault();
      head.classList.remove('drag-over');
      if (!draggingSlug) return;
      const targetFolder = isUncat ? '' : folder;
      const post = allPosts.find((p) => p.slug === draggingSlug);
      if (post && (post.category || '') === targetFolder) { draggingSlug = null; return; }
      await setCategory(draggingSlug, targetFolder);
      draggingSlug = null;
    });

    const renameBtn = head.querySelector('.folder-action.rename');
    if (renameBtn) renameBtn.addEventListener('click', (e) => { e.stopPropagation(); renameFolder(folder, items); });
    const delBtn = head.querySelector('.folder-action.del');
    if (delBtn) delBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteFolder(folder, items); });

    const itemsEl = document.createElement('div');
    itemsEl.className = 'folder-items';
    if (!items.length) {
      itemsEl.innerHTML = '<p class="empty-sub">空文件夹，可拖入文章</p>';
    } else {
      items.forEach((p) => {
        const item = document.createElement('div');
        item.className = 'post-item' + (p.slug === currentSlug ? ' active' : '') + (p.pinned ? ' is-pinned' : '');
        item.draggable = true;
        item.dataset.slug = p.slug;
        item.innerHTML =
          '<span class="pin-icon" title="' + (p.pinned ? '取消置顶' : '置顶') + '">' + (p.pinned ? '📌' : '📍') + '</span>' +
          '<div class="pi-body"><div class="pi-title">' + escapeHtml(p.title) + '</div>' +
          '<div class="pi-date">' + (p.pubDate ? String(p.pubDate).slice(0, 10) : '') + '</div></div>';
        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('pin-icon')) { e.stopPropagation(); togglePin(p.slug, !p.pinned); return; }
          loadPost(p.slug);
        });
        item.addEventListener('dragstart', (e) => { draggingSlug = p.slug; item.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
        itemsEl.appendChild(item);
      });
    }
    group.appendChild(head);
    group.appendChild(itemsEl);
    list.appendChild(group);
  });
}

async function setCategory(slug, category) {
  showStatus('正在移动到「' + (category || '未分类') + '」…', 'info');
  try {
    const r = await fetch('/api/set-category', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, category }) });
    if (r.ok) { await loadList(); showStatus('已移动到「' + (category || '未分类') + '」', 'success'); }
    else showStatus('移动失败', 'error');
  } catch (e) { showStatus('网络错误：' + e.message, 'error'); }
}

async function togglePin(slug, pinned) {
  try {
    const r = await fetch('/api/set-pin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, pinned }) });
    if (r.ok) { await loadList(); showStatus(pinned ? '已置顶' : '已取消置顶', 'success'); }
    else showStatus('操作失败', 'error');
  } catch (e) { showStatus('网络错误：' + e.message, 'error'); }
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
  document.getElementById('pin-toggle').checked = !!data.pinned;
  updatePreview();
  renderList();
}

function newPost() {
  currentSlug = null;
  originalSlug = null;
  ['title','slug','description','tags','category'].forEach((id) => document.getElementById(id).value = '');
  document.getElementById('pubDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('body').value = '';
  document.getElementById('pin-toggle').checked = false;
  updatePreview();
  renderList();
  document.getElementById('title').focus();
}

function updatePreview() {
  document.getElementById('preview').innerHTML = marked.parse(document.getElementById('body').value || '*预览区为空*');
}

async function publish() {
  const title = document.getElementById('title').value.trim();
  const body = document.getElementById('body').value;
  if (!title) return showStatus('请填写标题', 'error');
  if (!body.trim()) return showStatus('正文不能为空', 'error');
  const btn = document.getElementById('publish-btn');
  btn.disabled = true; btn.textContent = '发布中…';
  showStatus('正在写入并推送到 GitHub…', 'info');
  try {
    const r = await fetch('/api/publish', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description: document.getElementById('description').value.trim(),
        tags: document.getElementById('tags').value, pubDate: document.getElementById('pubDate').value,
        body, slug: document.getElementById('slug').value.trim() || undefined,
        originalSlug, category: document.getElementById('category').value.trim(),
        pinned: document.getElementById('pin-toggle').checked,
      }),
    });
    const data = await r.json();
    if (r.ok && data.ok) {
      currentSlug = data.slug; originalSlug = data.slug;
      document.getElementById('slug').value = data.slug;
      const cat = document.getElementById('category').value.trim();
      if (cat && !folders.includes(cat)) { folders.push(cat); saveFolders(); }
      if (data.pushed) showStatus('发布成功！slug: ' + data.slug, 'success');
      else if (data.hasRemote === false) showStatus('已提交到本地。slug: ' + data.slug, 'warn');
      else showStatus('已提交，push 失败：' + data.pushError, 'warn');
      loadList();
    } else showStatus(data.error || '发布失败', 'error');
  } catch (e) { showStatus('网络错误：' + e.message, 'error'); }
  finally { btn.disabled = false; btn.textContent = '发布到 GitHub'; }
}

// ==================== 媒体管理 ====================

async function loadMedia() {
  const r = await fetch('/api/media', { cache: 'no-store' });
  const data = await r.json();
  allMedia = data.media || { images: [], audio: [], video: [] };
  renderMedia();
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getMediaIcon(type) {
  return { images: '🖼️', audio: '🎵', video: '🎬' }[type] || '📄';
}

function getMediaTypeFromMime(mime) {
  if (mime.startsWith('image/')) return 'images';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';
  return null;
}

function renderMedia() {
  const list = document.getElementById('media-list');
  list.innerHTML = '';
  const types = [
    { key: 'images', label: 'Images 图片', icon: '🖼️' },
    { key: 'audio', label: 'Audio 音频', icon: '🎵' },
    { key: 'video', label: 'Video 视频', icon: '🎬' },
  ];

  types.forEach(({ key, label, icon }) => {
    const items = allMedia[key] || [];
    const group = document.createElement('div');
    group.className = 'media-group';
    const head = document.createElement('div');
    head.className = 'media-group-head';
    head.innerHTML =
      '<span class="arrow">▼</span>' +
      '<span class="folder-icon">' + icon + '</span>' +
      '<span class="name">' + escapeHtml(label) + '</span>' +
      '<span class="count">' + items.length + '</span>';
    head.addEventListener('click', () => group.classList.toggle('collapsed'));

    const itemsEl = document.createElement('div');
    itemsEl.className = 'media-items';

    if (!items.length) {
      itemsEl.innerHTML = '<p class="empty-sub">空</p>';
    } else {
      items.forEach((m) => {
        const item = document.createElement('div');
        item.className = 'media-item';
        item.draggable = true;
        item.dataset.path = '../../media/' + key + '/' + m.name;
        item.dataset.type = key;

        let thumbHtml;
        if (key === 'images') {
          thumbHtml = '<img class="media-thumb" src="/media/' + key + '/' + encodeURIComponent(m.name) + '" alt="" loading="lazy">';
        } else {
          thumbHtml = '<div class="media-thumb-icon">' + getMediaIcon(key) + '</div>';
        }

        item.innerHTML =
          thumbHtml +
          '<div class="media-info"><div class="media-name">' + escapeHtml(m.name) + '</div>' +
          '<div class="media-size">' + formatSize(m.size) + '</div></div>' +
          '<button class="media-del" title="删除">✕</button>';

        // 拖拽到编辑器
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/media-path', '../../media/' + key + '/' + m.name);
          e.dataTransfer.setData('text/media-type', key);
          e.dataTransfer.effectAllowed = 'copy';
        });

        // 点击插入到光标位置
        item.addEventListener('click', () => {
          insertMediaToEditor(key, '../../media/' + key + '/' + m.name, m.name);
        });

        // 删除
        item.querySelector('.media-del').addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!confirm('删除「' + m.name + '」？')) return;
          try {
            const r = await fetch('/api/delete-media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: key, name: m.name }) });
            if (r.ok) { loadMedia(); showStatus('已删除 ' + m.name, 'success'); }
          } catch (e) { showStatus('删除失败', 'error'); }
        });

        itemsEl.appendChild(item);
      });
    }
    group.appendChild(head);
    group.appendChild(itemsEl);
    list.appendChild(group);
  });
}

// 上传文件
async function uploadFile(file) {
  const mediaType = getMediaTypeFromMime(file.type);
  if (!mediaType) {
    showStatus('不支持的文件类型: ' + file.type + '（仅支持图片/音频/视频）', 'error');
    return null;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const r = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, type: mediaType, data: reader.result }),
        });
        const data = await r.json();
        if (r.ok && data.ok) {
          resolve({ path: data.path, type: mediaType, name: data.name });
        } else {
          showStatus('上传失败: ' + (data.error || '未知错误'), 'error');
          reject(new Error(data.error));
        }
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

// 在编辑器光标处插入媒体 Markdown
function insertMediaToEditor(type, mediaPath, name) {
  const textarea = document.getElementById('body');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);

  let insert;
  if (type === 'images') {
    insert = `![${name}](${mediaPath})\n`;
  } else if (type === 'audio') {
    insert = `<audio src="${mediaPath}" controls></audio>\n`;
  } else if (type === 'video') {
    insert = `<video src="${mediaPath}" controls></video>\n`;
  } else {
    insert = `[${name}](${mediaPath})\n`;
  }

  textarea.value = before + insert + after;
  const newPos = start + insert.length;
  textarea.selectionStart = textarea.selectionEnd = newPos;
  textarea.focus();
  updatePreview();
}

// ==================== 拖拽上传到编辑器 ====================

function initEditorDropZone() {
  const editorBody = document.getElementById('editor-body');
  const overlay = document.getElementById('upload-overlay');
  let dragCounter = 0;

  editorBody.addEventListener('dragenter', (e) => {
    if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      dragCounter++;
      overlay.classList.add('active');
    }
  });
  editorBody.addEventListener('dragover', (e) => {
    if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  });
  editorBody.addEventListener('dragleave', () => {
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      overlay.classList.remove('active');
    }
  });
  editorBody.addEventListener('drop', async (e) => {
    // 处理从文件系统拖入的文件
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      e.preventDefault();
      dragCounter = 0;
      overlay.classList.remove('active');

      const files = Array.from(e.dataTransfer.files);
      showStatus('正在上传 ' + files.length + ' 个文件…', 'info');

      for (const file of files) {
        try {
          const result = await uploadFile(file);
          if (result) {
            insertMediaToEditor(result.type, result.path, result.name);
          }
        } catch (e) {
          // 错误已在 uploadFile 中提示
        }
      }
      await loadMedia();
      showStatus('上传完成', 'success');
    }
    // 处理从媒体面板拖入的已有文件
    else if (e.dataTransfer && e.dataTransfer.getData('text/media-path')) {
      e.preventDefault();
      const mediaPath = e.dataTransfer.getData('text/media-path');
      const mediaType = e.dataTransfer.getData('text/media-type');
      const name = mediaPath.split('/').pop();
      insertMediaToEditor(mediaType, mediaPath, name);
    }
  });
}

// ==================== 辅助函数 ====================

function showStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg; el.className = 'status ' + type; el.hidden = false;
}
function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }

function newFolder() {
  const name = prompt('输入文件夹名称：');
  if (!name) return;
  const t = name.trim();
  if (!t) return;
  if (folders.includes(t) || t === '未分类') return showStatus('文件夹「' + t + '」已存在', 'warn');
  folders.push(t); saveFolders(); updateCategoryDatalist(); renderList();
  showStatus('文件夹「' + t + '」已创建，可拖入文章', 'success');
}

async function renameFolder(oldName, items) {
  const newName = prompt('将文件夹「' + oldName + '」重命名为：', oldName);
  if (!newName) return;
  const t = newName.trim();
  if (!t || t === oldName) return;
  if (folders.includes(t) || t === '未分类') return showStatus('文件夹「' + t + '」已存在', 'warn');
  showStatus('正在重命名…', 'info');
  let ok = 0, fail = 0;
  for (const p of items) {
    try {
      const r = await fetch('/api/set-category', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: p.slug, category: t }) });
      r.ok ? ok++ : fail++;
    } catch (e) { fail++; }
  }
  const idx = folders.indexOf(oldName);
  if (idx >= 0) { folders[idx] = t; saveFolders(); }
  await loadList();
  showStatus('已重命名为「' + t + '」' + (ok ? '，' + ok + ' 篇已更新' : '') + (fail ? '，' + fail + ' 篇失败' : ''), fail ? 'warn' : 'success');
}

async function deleteFolder(name, items) {
  if (items.length > 0) {
    if (!confirm('文件夹「' + name + '」下有 ' + items.length + ' 篇文章，删除后文章变为「未分类」。确认？')) return;
    showStatus('正在移动文章…', 'info');
    for (const p of items) {
      try { await fetch('/api/set-category', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: p.slug, category: '' }) }); } catch (e) {}
    }
  } else { if (!confirm('删除空文件夹「' + name + '」？')) return; }
  const idx = folders.indexOf(name);
  if (idx >= 0) { folders.splice(idx, 1); saveFolders(); }
  await loadList();
  showStatus('文件夹「' + name + '」已删除', 'success');
}

function setViewMode(mode) {
  document.getElementById('editor-body').dataset.mode = mode;
  document.querySelectorAll('.view-switch button').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
  // 切换到预览模式时刷新预览内容
  if (mode === 'preview' || mode === 'split') updatePreview();
}

function initDivider() {
  const divider = document.getElementById('divider');
  const container = document.getElementById('editor-body');
  let dragging = false;
  const onMove = (x) => {
    if (!dragging) return;
    const rect = container.getBoundingClientRect();
    let pct = Math.max(15, Math.min(85, ((x - rect.left) / rect.width) * 100));
    container.style.gridTemplateColumns = pct + '% 6px ' + (100 - pct) + '%';
  };
  divider.addEventListener('mousedown', (e) => { dragging = true; divider.classList.add('dragging'); document.body.style.userSelect = 'none'; document.body.style.cursor = 'col-resize'; e.preventDefault(); });
  document.addEventListener('mousemove', (e) => onMove(e.clientX));
  document.addEventListener('mouseup', () => { if (dragging) { dragging = false; divider.classList.remove('dragging'); document.body.style.userSelect = ''; document.body.style.cursor = ''; } });
  divider.addEventListener('touchstart', (e) => { dragging = true; divider.classList.add('dragging'); e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove', (e) => { if (dragging && e.touches[0]) onMove(e.touches[0].clientX); });
  document.addEventListener('touchend', () => { if (dragging) { dragging = false; divider.classList.remove('dragging'); } });
}

// 标签切换
function switchTab(tab) {
  document.querySelectorAll('.sidebar-tab').forEach((b) => b.classList.toggle('active', b.id === 'tab-' + tab));
  document.getElementById('panel-posts').style.display = tab === 'posts' ? '' : 'none';
  document.getElementById('panel-media').style.display = tab === 'media' ? '' : 'none';
  if (tab === 'media') loadMedia();
}

(async () => {
  if (!(await checkAuth())) return;
  loadFolders();
  document.getElementById('new-btn').onclick = newPost;
  document.getElementById('new-folder-btn').onclick = newFolder;
  document.getElementById('publish-btn').onclick = publish;
  document.getElementById('logout-btn').onclick = async () => { await fetch('/api/logout', { method: 'POST' }); location.href = '/login.html'; };
  document.getElementById('theme-toggle').onclick = toggleTheme;
  document.getElementById('search').addEventListener('input', renderList);
  document.getElementById('body').addEventListener('input', updatePreview);
  document.querySelectorAll('.view-switch button').forEach((b) => b.onclick = () => setViewMode(b.dataset.mode));
  document.getElementById('tab-posts').onclick = () => switchTab('posts');
  document.getElementById('tab-media').onclick = () => switchTab('media');

  // 上传按钮
  document.getElementById('upload-btn').onclick = () => document.getElementById('file-input').click();
  document.getElementById('file-input').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    showStatus('正在上传 ' + files.length + ' 个文件…', 'info');
    for (const file of files) {
      try { await uploadFile(file); } catch (e) {}
    }
    await loadMedia();
    showStatus('上传完成', 'success');
    e.target.value = '';
  });

  initDivider();
  initEditorDropZone();
  await loadList();
  newPost();
})();
