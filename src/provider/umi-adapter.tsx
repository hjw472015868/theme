/**
 * UmiJS 适配器
 * 使用 require.context 自动加载预设主题
 */

import React, { useEffect } from 'react';
import { ThemeProvider, registerThemes, type ThemeProviderProps } from './ThemeProvider';
import type { ThemeConfig } from '../tokens/types';

/**
 * Webpack require.context 类型声明
 */
interface RequireContext {
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
}

/**
 * 声明 require.context 函数类型
 */
declare const require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
  ): RequireContext;
};

/**
 * 自动加载预设主题
 */
const loadPresetThemes = (): Record<string, ThemeConfig> => {
  const themes: Record<string, ThemeConfig> = {};
  
  try {
    // 使用 require.context 获取 presets 目录下的所有 .json 文件
    const themeContext: RequireContext = require.context('../presets', false, /\.json$/);
    
    // 遍历所有主题文件
    themeContext.keys().forEach((filename: string) => {
      // 从文件名提取主题名称（去除 ./ 和 .json）
      const themeName = filename.replace(/^\.\//, '').replace(/\.json$/, '');
      
      // 加载主题配置
      const themeConfig = themeContext(filename) as ThemeConfig;
      
      themes[themeName] = themeConfig;
      
      console.log(`✅ 已加载预设主题: ${themeName}`);
    });
    
    // 如果没有加载到任何主题，抛出错误
    if (Object.keys(themes).length === 0) {
      console.warn('未找到任何主题文件，请确保 presets 目录下有 .json 文件');
    }
  } catch (error) {
    console.error('❌ 加载预设主题失败:', error);
    console.error('请确保 presets 目录下至少有一个 .json 主题文件');
  }
  
  return themes;
};

/**
 * UmiJS 主题提供者
 * 
 * @description 自动加载 presets 目录下的所有主题文件
 * 
 * @example
 * ```tsx
 * import { UmiThemeProvider } from '@km-design/theme-system';
 * 
 * export function rootContainer(container: React.ReactElement) {
 *   return (
 *     <UmiThemeProvider defaultTheme="km-base">
 *       {container}
 *     </UmiThemeProvider>
 *   );
 * }
 * ```
 */
export const UmiThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  ...props
}) => {
  // 自动加载预设主题
  useEffect(() => {
    const themes = loadPresetThemes();
    if (Object.keys(themes).length > 0) {
      registerThemes(themes);
    }
  }, []);

  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};

