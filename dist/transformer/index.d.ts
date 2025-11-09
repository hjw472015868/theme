/**
 * 主题转换器
 * 将 Design Tokens 转换为 Ant Design、Tailwind CSS 和 CSS Variables
 */
import type { ThemeConfig, AntDesignTheme, CSSVariables, TailwindTheme, TransformedTheme } from '../tokens/types';
/**
 * 主题转换器类
 */
export declare class ThemeTransformer {
    private config;
    constructor(config: ThemeConfig);
    /**
     * 转换为 Ant Design ConfigProvider 配置
     */
    toAntdTheme(): AntDesignTheme;
    /**
     * 转换为 CSS Variables
     */
    toCSSVariables(): CSSVariables;
    /**
     * 转换为 Tailwind CSS 配置
     */
    toTailwindConfig(): TailwindTheme;
    /**
     * 转换所有格式
     */
    transformAll(): TransformedTheme;
    /**
     * 驼峰转短横线
     */
    private camelToKebab;
    /**
     * 添加颜色梯度到 CSS Variables
     */
    private addColorScale;
    /**
     * 颜色梯度转对象
     */
    private colorScaleToObject;
}
/**
 * 快捷函数：从主题配置生成所有需要的输出
 */
export declare function transformTheme(config: ThemeConfig): TransformedTheme;
/**
 * 应用 CSS Variables 到文档
 */
export declare function applyCSSVariables(cssVars: CSSVariables): void;
/**
 * 从 JSON 加载主题配置
 */
export declare function loadThemeFromJSON(jsonPath: string): Promise<ThemeConfig>;
//# sourceMappingURL=index.d.ts.map