/**
 * UmiJS 适配器
 * 使用 require.context 自动加载预设主题
 */
import React from 'react';
import { type ThemeProviderProps } from './ThemeProvider';
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
export declare const UmiThemeProvider: React.FC<ThemeProviderProps>;
//# sourceMappingURL=umi-adapter.d.ts.map