import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [rehypeKatex],
      providerImportSource: '@mdx-js/react',
    }),
    react(),
  ],
})
