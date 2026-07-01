import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const index = posts.map((post) => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags || [],
    category: post.data.category || '',
    pinned: post.data.pinned || false,
    pubDate: post.data.pubDate.toISOString().slice(0, 10),
    // 正文：去掉 Markdown 标记，保留纯文本用于搜索
    body: post.body
      .replace(/^#{1,6}\s+/gm, '')      // 标题标记
      .replace(/```[\s\S]*?```/g, ' ')   // 代码块
      .replace(/`[^`]+`/g, ' ')          // 行内代码
      .replace(/!\[.*?\]\(.*?\)/g, ' ')  // 图片
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 链接保留文字
      .replace(/[*_~>#-]/g, ' ')         // 格式标记
      .replace(/\n{3,}/g, '\n\n')        // 多余空行
      .slice(0, 3000),                    // 限制长度避免索引过大
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
