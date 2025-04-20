import { defineConfig } from 'vite'
import { resolve } from 'path'


export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'lox',
      fileName: (format) => `lox.${format}.js`
    }
  }
})