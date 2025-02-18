// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import path from 'node:path';

export default defineConfig({
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [
              './node_modules/@uswds/uswds/packages/'
          ]
        }
      }
    },
  },
  devToolbar: {
    enabled: false
  }
});
