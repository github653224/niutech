// 发布台前端逻辑
let currentSlug = null;
let originalSlug = null;

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
  const list = document.getElementById('post-list');
  list.innerHTML = '';
  if (!data.posts.length) {
    list.innerHTML = '<p class="empty">还没有文章</p>';
    return;
  }
  data.posts.forEach((p) => {
    const item = document.createElement('div');
    item.className = 'post-item';
    if (p.slug === currentSlug) item.classList.add('active');
    item.innerHTML = `<div class="pi-title">${escapeHtml(p.title)}</div><div class="pi-date">${p.pubDate || ''}</div>`;
    item.onclick = () => loadPost(p.slug);
    list.appendChild(item);
  });
}

async function loadPost(slug) {
  const r = await fetch(`/api/posts/${slug}`);
  if (!r.ok) return;
  const data = await r.json();
  currentSlug = slug;
  originalSlug = slug;
  document.getElementById('title').value = data.title || '';
  document.getElementById('slug').value = slug;
  document.getElementById('description').value = data.description || '';
  document.getElementById('tags').value = (data.tags || []).join(', ');
  document.getElementById('pubDate').value = (data.pubDate || '').slice(0, 10);
  document.getElementById('body').value = data.body || '';
  updatePreview();
  loadList();
}

function newPost() {
  currentSlug = null;
  originalSlug = null;
  document.getElementById('title').value = '';
  document.getElementById('slug').value = '';
  document.getElementById('description').value = '';
  document.getElementById('tags').value = '';
  document.getElementById('pubDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('body').value = '';
  updatePreview();
  loadList();
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
      }),
    });
    const data = await r.json();
    if (r.ok && data.ok) {
      currentSlug = data.slug;
      originalSlug = data.slug;
      document.getElementById('slug').value = data.slug;
      if (data.pushed) {
        showStatus(`发布成功！GitHub Actions 将自动构建部署。slug: ${data.slug}`, 'success');
      } else if (data.hasRemote === false) {
        showStatus(`已提交到本地，但未配置 remote。请添加 remote 后手动 push。slug: ${data.slug}`, 'warn');
      } else {
        showStatus(`已提交，但 push 失败：${data.pushError}。可手动 push。slug: ${data.slug}`, 'warn');
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

(async () => {
  if (!(await checkAuth())) return;
  document.getElementById('new-btn').onclick = newPost;
  document.getElementById('publish-btn').onclick = publish;
  document.getElementById('logout-btn').onclick = async () => {
    await fetch('/api/logout', { method: 'POST' });
    location.href = '/login.html';
  };
  document.getElementById('body').addEventListener('input', updatePreview);
  await loadList();
  newPost();
})();
