/**
 * Next.js 适配器
 * 使用静态导入注册预设主题
 */

'use client';

import React, { useEffect } from 'react';
import { ThemeProvider, registerThemes, type ThemeProviderProps } from './ThemeProvider';

// 静态导入预设主题（Next.js 需要）
import defaultTheme from '../presets/default.json';
import darkTheme from '../presets/dark.json';
import kmBaseTheme from '../presets/km-base.json';
import springFestivalTheme from '../presets/spring-festival.json';
import forestTheme from '../presets/forest.json';
import partyTheme from '../presets/party.json';
import redTheme from '../presets/red-theme.json';

// 注意：Next.js 需要静态导入，所有主题文件必须在构建时存在
// 如果某个主题文件不存在，需要注释掉对应的导入

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
  // 注册预设主题
  useEffect(() => {
    const themes: Record<string, any> = {
      default: defaultTheme,
      dark: darkTheme,
      'km-base': kmBaseTheme,
      'spring-festival': springFestivalTheme,
      forest: forestTheme,
      party: partyTheme,
      'red-theme': redTheme,
      // 如果没有 light.json，使用 default 作为 light
      light: defaultTheme,
    };

    registerThemes(themes);
  }, []);

  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};

