/**
 * @km-design/theme-system
 * 统一主题系统入口
 */
export type { ThemeConfig, ColorScale, SemanticColors, BorderConfig, AntDesignTheme, CSSVariables, TailwindTheme, TransformedTheme, } from './tokens/types';
export { ThemeTransformer, transformTheme, applyCSSVariables, loadThemeFromJSON, } from './transformer';
export { ThemeProvider, useTheme, registerTheme, registerThemes, unregisterTheme, getRegisteredThemes, getAvailableThemes, getThemeMetadata, isThemeRegistered, } from './provider/ThemeProvider';
export { UmiThemeProvider } from './provider/umi-adapter';
export { NextThemeProvider } from './provider/nextjs-adapter';
export { default as ThemeSwitcher } from './components/ThemeSwitcher';
export { default as ThemeEditor } from './components/ThemeEditor';
export { default as defaultTheme } from './presets/default.json';
export { default as darkTheme } from './presets/dark.json';
export { default as springFestivalTheme } from './presets/spring-festival.json';
export { default as kmBaseTheme } from './presets/km-base.json';
export { default as forestTheme } from './presets/forest.json';
export { default as partyTheme } from './presets/party.json';
export { default as redTheme } from './presets/red-theme.json';
//# sourceMappingURL=index.d.ts.map