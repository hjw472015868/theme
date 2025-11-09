/**
 * 主题提供者组件（核心实现，框架无关）
 * 统一管理 Ant Design 和 CSS Variables 的主题应用
 *
 * @description 核心逻辑框架无关，通过适配器适配不同框架
 * @version 1.0.0
 */
import React from 'react';
import type { ThemeConfig, TransformedTheme } from '../tokens/types';
/**
 * 注册主题到系统
 * @param themeName 主题名称
 * @param themeConfig 主题配置
 */
export declare const registerTheme: (themeName: string, themeConfig: ThemeConfig) => void;
/**
 * 批量注册主题
 * @param themes 主题映射对象
 */
export declare const registerThemes: (themes: Record<string, ThemeConfig>) => void;
/**
 * 注销主题
 * @param themeName 主题名称
 */
export declare const unregisterTheme: (themeName: string) => void;
/**
 * 获取所有已注册的主题
 */
export declare const getRegisteredThemes: () => Record<string, ThemeConfig>;
/**
 * 主题上下文类型
 */
export interface ThemeContextType {
    currentTheme: string;
    themeConfig: ThemeConfig | null;
    transformedTheme: TransformedTheme | null;
    switchTheme: (themeName: string) => void;
    availableThemes: string[];
    isDarkMode?: boolean;
}
/**
 * 主题提供者属性
 */
export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: string;
    enableStorage?: boolean;
    storageKey?: string;
}
/**
 * 主题提供者组件（核心实现）
 *
 * @description 框架无关的核心实现，支持 SSR
 */
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
/**
 * 使用主题 Hook
 */
export declare function useTheme(): ThemeContextType;
/**
 * 获取已注册主题列表
 */
export declare const getAvailableThemes: () => string[];
/**
 * 获取主题元信息
 */
export declare function getThemeMetadata(themeName: string): {
    name: string;
    version: string;
    author: string;
    description: string;
    mode: "light" | "dark";
    type: "default" | "festival";
} | null;
/**
 * 检查主题是否已注册
 */
export declare function isThemeRegistered(themeName: string): boolean;
/**
 * 检查是否为预设主题（需要适配器提供预设主题列表）
 */
export declare function isPresetTheme(themeName: string): boolean;
//# sourceMappingURL=ThemeProvider.d.ts.map