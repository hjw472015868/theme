/**
 * Next.js 适配器
 * 使用静态导入注册预设主题
 */
import React from 'react';
import { type ThemeProviderProps } from './ThemeProvider';
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
export declare const NextThemeProvider: React.FC<ThemeProviderProps>;
//# sourceMappingURL=nextjs-adapter.d.ts.map