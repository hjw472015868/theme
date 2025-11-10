#!/usr/bin/env node

/**
 * 自动生成主题导入代码
 * 扫描 presets/ 目录下的所有 .json 文件，自动生成导入和注册代码
 */

const fs = require('fs');
const path = require('path');

const PRESETS_DIR = path.resolve(__dirname, '../presets');
const SRC_PRESETS_DIR = path.resolve(__dirname, '../src/presets');
const NEXTJS_ADAPTER_FILE = path.resolve(__dirname, '../src/provider/nextjs-adapter.tsx');
const INDEX_FILE = path.resolve(__dirname, '../src/index.ts');

/**
 * 将文件名转换为变量名
 * @param {string} filename 文件名（不含扩展名）
 * @returns {string} 变量名
 */
function filenameToVarName(filename) {
  // 将 kebab-case 转换为 camelCase
  let varName = filename
    .split('-')
    .map((part, index) => {
      if (index === 0) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
  
  // 检查转换后的变量名是否已经以 theme 结尾（不区分大小写）
  const endsWithTheme = /theme$/i.test(varName);
  
  // 如果变量名已经以 theme 结尾，不再添加 Theme
  if (!endsWithTheme) {
    varName += 'Theme';
  }
  
  return varName;
}

/**
 * 将文件名转换为主题名称（用于注册）
 * @param {string} filename 文件名（不含扩展名）
 * @returns {string} 主题名称
 */
function filenameToThemeName(filename) {
  return filename;
}

/**
 * 扫描 presets 目录，获取所有主题文件
 */
function scanPresetThemes() {
  const presetsDir = fs.existsSync(PRESETS_DIR) ? PRESETS_DIR : SRC_PRESETS_DIR;
  
  if (!fs.existsSync(presetsDir)) {
    console.error(`❌ 错误: presets 目录不存在: ${presetsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(presetsDir);
  const themeFiles = files
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      filename: file,
      name: file.replace('.json', ''),
      path: path.join(presetsDir, file),
    }))
    .sort((a, b) => {
      // default 和 dark 排在前面
      if (a.name === 'default') return -1;
      if (b.name === 'default') return 1;
      if (a.name === 'dark') return -1;
      if (b.name === 'dark') return 1;
      return a.name.localeCompare(b.name);
    });

  return themeFiles;
}

/**
 * 生成 Next.js 适配器的导入代码
 */
function generateNextjsAdapterImports(themes) {
  const imports = themes.map(theme => {
    const varName = filenameToVarName(theme.name);
    return `import ${varName} from '../presets/${theme.filename}';`;
  }).join('\n');

  const registrations = themes.map(theme => {
    const varName = filenameToVarName(theme.name);
    const themeName = filenameToThemeName(theme.name);
    return `      '${themeName}': ${varName},`;
  }).join('\n');

  // 找到 default 主题的变量名，用于 light 别名
  const defaultTheme = themes.find(t => t.name === 'default');
  const defaultVarName = defaultTheme ? filenameToVarName(defaultTheme.name) : 'defaultTheme';

  return { imports, registrations, defaultVarName };
}

/**
 * 生成主入口文件的导出代码
 */
function generateIndexExports(themes) {
  return themes.map(theme => {
    const varName = filenameToVarName(theme.name);
    return `export { default as ${varName} } from './presets/${theme.filename}';`;
  }).join('\n');
}

/**
 * 更新 Next.js 适配器文件
 */
function updateNextjsAdapter(themes) {
  const { imports, registrations, defaultVarName } = generateNextjsAdapterImports(themes);

  const template = `/**
 * Next.js 适配器
 * 使用静态导入注册预设主题
 * 
 * ⚠️ 此文件由 scripts/generate-theme-imports.js 自动生成
 * 请勿手动修改！如需添加新主题，请将主题文件放入 presets/ 目录，然后运行：
 * pnpm run generate:themes
 */

'use client';

import React, { useEffect } from 'react';
import { ThemeProvider, registerThemes, type ThemeProviderProps } from './ThemeProvider';

// 自动生成的预设主题导入
${imports}

/**
 * Next.js 主题提供者
 * 
 * @description 静态导入并注册预设主题，适配 Next.js App Router
 * 
 * @example
 * \`\`\`tsx
 * 'use client';
 * import { NextThemeProvider } from '@km-design/theme-system';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <NextThemeProvider defaultTheme="light">
 *           {children}
 *         </NextThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * \`\`\`
 */
export const NextThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  ...props
}) => {
  // 自动注册预设主题
  useEffect(() => {
    const themes: Record<string, any> = {
${registrations}
      // 如果没有 light.json，使用 default 作为 light
      light: ${defaultVarName},
    };

    registerThemes(themes);
  }, []);

  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
`;

  fs.writeFileSync(NEXTJS_ADAPTER_FILE, template, 'utf8');
  console.log(`✅ 已更新: ${path.relative(process.cwd(), NEXTJS_ADAPTER_FILE)}`);
}

/**
 * 更新主入口文件
 */
function updateIndexFile(themes) {
  // 读取现有文件
  const existingContent = fs.readFileSync(INDEX_FILE, 'utf8');
  
  // 找到预设主题导出的位置
  const exportStartMarker = '// 预设主题（可选导出，用于手动注册）';
  const exportEndMarker = '\n\n';
  
  const exportStartIndex = existingContent.indexOf(exportStartMarker);
  if (exportStartIndex === -1) {
    console.error('❌ 错误: 找不到预设主题导出标记');
    return;
  }

  const beforeExports = existingContent.substring(0, exportStartIndex + exportStartMarker.length);
  const afterExportsIndex = existingContent.indexOf(exportEndMarker, exportStartIndex);
  const afterExports = afterExportsIndex !== -1 
    ? existingContent.substring(afterExportsIndex)
    : '';

  const newExports = '\n' + generateIndexExports(themes);
  
  const newContent = beforeExports + newExports + afterExports;
  
  fs.writeFileSync(INDEX_FILE, newContent, 'utf8');
  console.log(`✅ 已更新: ${path.relative(process.cwd(), INDEX_FILE)}`);
}

/**
 * 确保 src/presets 目录存在并同步文件
 */
function syncPresetsToSrc(themes) {
  // 确保目录存在
  if (!fs.existsSync(SRC_PRESETS_DIR)) {
    fs.mkdirSync(SRC_PRESETS_DIR, { recursive: true });
  }

  // 复制文件到 src/presets
  themes.forEach(theme => {
    const srcFile = path.join(SRC_PRESETS_DIR, theme.filename);
    if (!fs.existsSync(srcFile)) {
      fs.copyFileSync(theme.path, srcFile);
      console.log(`📋 已复制: ${theme.filename} -> src/presets/`);
    }
  });
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 扫描预设主题文件...\n');
  
  const themes = scanPresetThemes();
  
  if (themes.length === 0) {
    console.error('❌ 错误: 未找到任何主题文件');
    process.exit(1);
  }

  console.log(`✅ 找到 ${themes.length} 个主题文件:`);
  themes.forEach(theme => {
    console.log(`   - ${theme.name}`);
  });
  console.log('');

  // 同步文件到 src/presets
  syncPresetsToSrc(themes);

  // 更新文件
  updateNextjsAdapter(themes);
  updateIndexFile(themes);

  console.log('\n✨ 主题导入代码生成完成！');
  console.log('💡 提示: 运行 pnpm build 重新构建包');
}

main();

