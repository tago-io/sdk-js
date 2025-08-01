import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/modules.ts',
  format: ['esm', 'cjs'],
  outDir: './lib',
  clean: true,
  dts: true,
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.cjs' : '.js',
    dts: '.d.ts'
  }),
  splitting: false,
  sourcemap: true,
  target: 'es2020',
  external: [
    'nanoid',
    'papaparse', 
    'qs',
    'eventsource'
  ]
})