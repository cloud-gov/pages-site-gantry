// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const RENDER_MODE = <'static' | 'server' | undefined>process.env.RENDER_MODE

let adapter
if (RENDER_MODE !== 'static') {
  adapter = node({
    mode: 'standalone',
  })
}

export default defineConfig({
  base: process.env.BASEURL,
  output: RENDER_MODE || 'server',
  adapter,
  outDir: './_site',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [
              './node_modules/@uswds/uswds/packages/'
          ],
          quietDeps: true
        }
      }
    },
    resolve: {
      alias: [
        {
          find: '@uswds-images',
          replacement: '/node_modules/@uswds/uswds/dist/img'
        }
      ]
    },
    assetsInclude: ['**/*.png', '**/*.svg']
  },
  devToolbar: {
    enabled: false
  }
});
