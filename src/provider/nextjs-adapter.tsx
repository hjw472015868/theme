/**
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
import defaultTheme from '../presets/default.json';
import darkTheme from '../presets/dark.json';
import forestTheme from '../presets/forest.json';
import kmBaseTheme from '../presets/km-base.json';
import kmFlowLightTheme from '../presets/km-flow-light-theme.json';
import partyTheme from '../presets/party.json';
import redTheme from '../presets/red-theme.json';
import springFestivalTheme from '../presets/spring-festival.json';

/**
 * Next.js 主题提供者
 * 
 * @description 静态导入并注册预设主题，适配 Next.js App Router
 * 
 * @example
 * ```tsx
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
 * ```
 */
export const NextThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  ...props
}) => {
  // 自动注册预设主题
  useEffect(() => {
    const themes: Record<string, any> = {
      'default': defaultTheme,
      'dark': darkTheme,
      'forest': forestTheme,
      'km-base': kmBaseTheme,
      'km-flow-light-theme': kmFlowLightTheme,
      'party': partyTheme,
      'red-theme': redTheme,
      'spring-festival': springFestivalTheme,
      // 如果没有 light.json，使用 default 作为 light
      light: defaultTheme,
    };

    registerThemes(themes);
  }, []);

  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
