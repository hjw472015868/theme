const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');
const postcss = require('rollup-plugin-postcss');
const { terser } = require('rollup-plugin-terser');
const path = require('path');
const fs = require('fs');

// 简单的复制函数（用于复制预设主题）
function copyPresets() {
  return {
    name: 'copy-presets',
    buildEnd() {
      const srcPresets = path.resolve(__dirname, 'src/presets');
      const distPresets = path.resolve(__dirname, 'dist/presets');
      const rootPresets = path.resolve(__dirname, 'presets');
      
      // 确保目录存在
      [distPresets, rootPresets].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });
      
      // 复制文件
      if (fs.existsSync(srcPresets)) {
        const files = fs.readdirSync(srcPresets);
        files.forEach(file => {
          if (file.endsWith('.json')) {
            const srcFile = path.join(srcPresets, file);
            fs.copyFileSync(srcFile, path.join(distPresets, file));
            fs.copyFileSync(srcFile, path.join(rootPresets, file));
          }
        });
      }
    },
  };
}

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),
    json(), // 支持导入 JSON 文件
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    }),
    commonjs(),
    postcss({
      extract: true,
      minimize: true,
      extensions: ['.css', '.less'],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
    }),
    copyPresets(),
    terser(),
  ],
  external: ['react', 'react-dom', 'antd', '@ant-design/icons'],
};

