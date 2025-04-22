// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const RENDER_MODE = <'static' | 'server' | undefined>process.env.RENDER_MODE

export default defineConfig({
  output: RENDER_MODE || 'server',
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
