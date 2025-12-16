import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

export default {
  input: 'src/index.ts', // 入口文件
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'CationMonitor', // <script> 引入时的全局变量名',
      sourcemap: true,
      plugins: [terser()] // UMD 格式进行压缩体积
    }
  ],
  plugins: [
    // 处理 Web Worker
    webWorkerLoader({
      // 关键配置项
      targetPlatform: 'browser', // 目标平台（browser/node）
      extensions: ['.ts', '.js'],
      preserveSource: true, // 保留 Worker 源码的 sourcemap
      inline: false // 是否将 Worker 内联为 Blob URL（无需生成独立文件）
    }),
    resolve({
      extensions: ['.ts', '.js']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    })
  ]
};
