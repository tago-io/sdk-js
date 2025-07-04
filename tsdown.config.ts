import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/modules.ts',
  outDir: './lib',
  format: ['cjs'],
  target: 'ES2020',
  sourcemap: true,
  clean: true,
  dts: true,
  tsconfig: './tsconfig.json',
  external: [
    'nanoid',
    'papaparse',
    'qs',
    'eventsource'
  ]
});
