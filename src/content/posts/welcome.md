---
title: "你好，欢迎来到「热爱技术的小牛」"
description: "这是一篇关于这个博客、关于我、以及你在这里能看到什么的开场白。"
pubDate: 2026-07-01
tags:
  - "随笔"
  - "公告"
category: "公众号文章"
pinned: true
password: "123456"
draft: false
---

你好，欢迎来到我的博客。

我是**热爱技术的小牛**，一名测试开发工程师。平时主要在做测试提效工具、AI 提效工具，以及一些 AI SaaS 项目。

## 这里会有什么

这个博客会记录我日常工程实践中的内容：

- **测试提效**：用例生成、自动化执行、结果分析、缺陷定位相关的工具与思路
- **AI 提效**：把 LLM / Agent 能力工程化，落地到研发与测试的真实场景
- **AI SaaS**：独立开发面向团队的 AI 产品，从想法到上线的全过程
- **工程思考**：架构设计、技术选型、踩坑复盘

文章都是 Markdown 写的，代码块可以正常高亮，比如：

```python
def should_release(pr_diff, test_report):
    """根据 PR 变更和测试报告给出发布建议"""
    if test_report.blockers:
        return "阻断"
    if pr_diff.risky_files and not test_report.covered:
        return "谨慎放行"
    return "放行"
```

## 这个博客本身也是个项目

博客用 [Astro](https://astro.build/) 构建，托管在 GitHub Pages 上。写文章的流程是：

1. 本地启动发布服务
2. 浏览器打开管理台，登录后用 Markdown 编辑器写文章
3. 点「发布」，自动 commit + push 到 GitHub
4. GitHub Actions 自动构建并部署

也就是说，这个博客的源码、内容、发布工具全在一个仓库里，Git 就是数据库。

## 最后

如果你对某篇文章有疑问或想法，欢迎到 GitHub 仓库提 Issue 交流。

让我们开始吧。

<audio src="/media/audio/test_vedio.MP3" controls></audio>


<video src="/media/video/test_vedio.mp4" controls></video>
