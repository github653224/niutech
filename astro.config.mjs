// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { remarkMediaBaseUrl } from './src/utils/remark-media-base.js';

export default defineConfig({
  site: 'https://github653224.github.io',
  base: '/niutech',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [tailwind(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    remarkPlugins: [[remarkMediaBaseUrl, { base: '/niutech' }]],
  },
});
