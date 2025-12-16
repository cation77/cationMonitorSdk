import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const extensions = ['.ts', '.js'];

const basePlugins = [resolve({ extensions }), commonjs()];

export default [
  // ESM + Worker 输出（含类型）
  {
    input: {
      index: 'src/index.ts',
      'sender.worker': 'src/sender.worker.ts'
    },
    output: {
      dir: 'dist/esm',
      format: 'es',
      sourcemap: true,
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js'
    },
    plugins: [
      ...basePlugins,
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        // 必须位于 output.dir 内部
        declarationDir: 'dist/esm/types'
      })
    ],
    treeshake: true
  },
  // CJS 输出（主入口）
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      ...basePlugins,
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      })
    ],
    treeshake: true
  },
  // UMD 输出（主入口）
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'CationMonitor',
      sourcemap: true
    },
    plugins: [
      ...basePlugins,
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      }),
      terser()
    ],
    treeshake: true
  }
];
