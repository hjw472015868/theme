/**
 * 主题提供者组件（核心实现，框架无关）
 * 统一管理 Ant Design 和 CSS Variables 的主题应用
 * 
 * @description 核心逻辑框架无关，通过适配器适配不同框架
 * @version 1.0.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { transformTheme, applyCSSVariables } from '../transformer';
import type { ThemeConfig, TransformedTheme } from '../tokens/types';

/**
 * 主题注册表（由适配器填充）
 */
let THEME_REGISTRY: Record<string, ThemeConfig> = {};

/**
 * 注册主题到系统
 * @param themeName 主题名称
 * @param themeConfig 主题配置
 */
export const registerTheme = (themeName: string, themeConfig: ThemeConfig): void => {
  THEME_REGISTRY[themeName] = themeConfig;
  console.log(`✅ 主题 "${themeName}" 已注册`);
};

/**
 * 批量注册主题
 * @param themes 主题映射对象
 */
export const registerThemes = (themes: Record<string, ThemeConfig>): void => {
  THEME_REGISTRY = { ...THEME_REGISTRY, ...themes };
  console.log(`✅ 已注册 ${Object.keys(themes).length} 个主题`);
};

/**
 * 注销主题
 * @param themeName 主题名称
 */
export const unregisterTheme = (themeName: string): void => {
  delete THEME_REGISTRY[themeName];
  console.log(`主题 "${themeName}" 已注销`);
};

/**
 * 获取所有已注册的主题
 */
export const getRegisteredThemes = (): Record<string, ThemeConfig> => {
  return THEME_REGISTRY;
};

/**
 * 主题上下文类型
 */
export interface ThemeContextType {
  currentTheme: string;
  themeConfig: ThemeConfig | null;
  transformedTheme: TransformedTheme | null;
  switchTheme: (themeName: string) => void;
  availableThemes: string[];
  isDarkMode?: boolean; // Next.js 专用
}

/**
 * 主题上下文
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主题提供者属性
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string; // 默认主题名称
  enableStorage?: boolean; // 是否启用 localStorage 持久化
  storageKey?: string; // localStorage 存储键名
}

/**
 * 主题提供者组件（核心实现）
 * 
 * @description 框架无关的核心实现，支持 SSR
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme: defaultThemeName = 'default',
  enableStorage = true,
  storageKey = 'km-theme',
}) => {
  // 从 localStorage 恢复主题（如果启用，SSR 安全）
  const getInitialTheme = useCallback((): string => {
    if (!enableStorage || typeof window === 'undefined') {
      return defaultThemeName;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      // 即使主题还没注册，也先读取 localStorage 的值
      // 后续会在主题注册完成后验证并应用
      if (stored) {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    return defaultThemeName;
  }, [enableStorage, storageKey, defaultThemeName]);

  const [currentTheme, setCurrentTheme] = useState<string>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  // 确保组件已挂载（避免 SSR 问题）
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在主题注册完成后，验证并恢复 localStorage 中的主题
  const restoredRef = useRef(false);
  
  useEffect(() => {
    if (!mounted || !enableStorage || typeof window === 'undefined' || restoredRef.current) return;

    const availableThemes = Object.keys(THEME_REGISTRY);
    // 如果主题已注册且还未恢复过
    if (availableThemes.length > 0) {
      restoredRef.current = true;
      
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored && availableThemes.includes(stored)) {
          // 如果 localStorage 中的主题与当前主题不同，恢复它
          if (stored !== currentTheme) {
            console.log(`✅ 从 localStorage 恢复主题: ${stored}`);
            setCurrentTheme(stored);
          }
        } else if (stored && !availableThemes.includes(stored)) {
          // 如果保存的主题不存在，使用默认主题
          console.warn(`⚠️ 保存的主题 "${stored}" 不存在，使用默认主题`);
          setCurrentTheme(defaultThemeName);
          localStorage.setItem(storageKey, defaultThemeName);
        }
      } catch (error) {
        console.warn('Failed to restore theme from localStorage:', error);
      }
    }
  }, [mounted, enableStorage, storageKey, defaultThemeName, currentTheme]);

  // 获取当前主题配置（支持 localStorage 覆盖）
  const themeConfig = useMemo(() => {
    const config = THEME_REGISTRY[currentTheme];
    
    if (!config) {
      console.warn(`主题 "${currentTheme}" 未找到，使用默认主题`);
      return THEME_REGISTRY[defaultThemeName] || Object.values(THEME_REGISTRY)[0] || null;
    }
    
    // 检查是否有 localStorage 中的覆盖配置
    if (enableStorage && mounted && typeof window !== 'undefined') {
      try {
        const overrideKey = `km-theme-override-${currentTheme}`;
        const overrideConfig = localStorage.getItem(overrideKey);
        
        if (overrideConfig) {
          const parsedConfig = JSON.parse(overrideConfig) as ThemeConfig;
          console.log(`✅ 已加载主题覆盖配置: ${currentTheme}`);
          return parsedConfig;
        }
      } catch (error) {
        console.warn(`Failed to load theme override for ${currentTheme}:`, error);
      }
    }
    
    return config;
  }, [currentTheme, enableStorage, mounted, defaultThemeName]);

  // 转换主题配置
  const transformedTheme = useMemo(() => {
    if (!themeConfig) return null;
    return transformTheme(themeConfig);
  }, [themeConfig]);

  // 是否为暗色模式
  const isDarkMode = useMemo(() => {
    return themeConfig?.meta.mode === 'dark';
  }, [themeConfig]);

  // 切换主题
  const switchTheme = useCallback((themeName: string) => {
    const availableThemes = Object.keys(THEME_REGISTRY);
    
    if (!availableThemes.includes(themeName)) {
      console.warn(`Theme "${themeName}" not found, available themes:`, availableThemes);
      return;
    }

    setCurrentTheme(themeName);

    // 保存到 localStorage
    if (enableStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, themeName);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [enableStorage, storageKey]);

  // 应用 CSS Variables（SSR 安全）
  useEffect(() => {
    if (!mounted || !transformedTheme || typeof document === 'undefined') return;

    applyCSSVariables(transformedTheme.cssVars);

    // 设置 HTML 和 body 的属性用于特殊样式
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('data-theme-mode', themeConfig?.meta.mode || 'light');
    document.body.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme-mode', themeConfig?.meta.mode || 'light');

    // 清理
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.removeAttribute('data-theme-mode');
        document.body.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme-mode');
      }
    };
  }, [transformedTheme, currentTheme, themeConfig, mounted]);

  // 上下文值
  const contextValue: ThemeContextType = useMemo(() => ({
    currentTheme,
    themeConfig,
    transformedTheme,
    switchTheme,
    availableThemes: Object.keys(THEME_REGISTRY),
    isDarkMode,
  }), [currentTheme, themeConfig, transformedTheme, switchTheme, isDarkMode]);

  // SSR 期间使用默认配置，避免闪烁
  if (!mounted) {
    const defaultConfig = THEME_REGISTRY[defaultThemeName] || Object.values(THEME_REGISTRY)[0];
    const defaultTransformed = defaultConfig ? transformTheme(defaultConfig) : null;

    return (
      <ThemeContext.Provider value={{
        currentTheme: defaultThemeName,
        themeConfig: defaultConfig || null,
        transformedTheme: defaultTransformed,
        switchTheme: () => {},
        availableThemes: Object.keys(THEME_REGISTRY),
        isDarkMode: defaultConfig?.meta.mode === 'dark',
      }}>
        <ConfigProvider 
          theme={defaultTransformed?.antd} 
          locale={zhCN}
        >
          {children}
        </ConfigProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider 
        theme={transformedTheme?.antd} 
        locale={zhCN}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

/**
 * 使用主题 Hook
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * 获取已注册主题列表
 */
export const getAvailableThemes = (): string[] => {
  return Object.keys(THEME_REGISTRY);
};

/**
 * 获取主题元信息
 */
export function getThemeMetadata(themeName: string) {
  const theme = THEME_REGISTRY[themeName];
  return theme ? theme.meta : null;
}

/**
 * 检查主题是否已注册
 */
export function isThemeRegistered(themeName: string): boolean {
  return themeName in THEME_REGISTRY;
}

/**
 * 检查是否为预设主题（需要适配器提供预设主题列表）
 */
export function isPresetTheme(themeName: string): boolean {
  // 这个函数由适配器实现，这里提供默认实现
  return ['default', 'light', 'dark', 'spring-festival', 'km-base'].includes(themeName);
}

