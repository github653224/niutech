// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { remarkMediaBaseUrl } from './src/utils/remark-media-base.js';

export default defineConfig({
  site: 'https://github653224.github.io',
  base: '/niutech',
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    remarkPlugins: [[remarkMediaBaseUrl, { base: '/niutech' }]],
  },
});
