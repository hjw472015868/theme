/**
 * 主题系统类型定义
 * 支持多主题、暗色模式、节日主题
 */
/**
 * 颜色梯度定义（50-900）
 */
export interface ColorScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}
/**
 * 语义化颜色定义
 * 用于不同场景的颜色语义
 */
export interface SemanticColors {
    background: string;
    foreground: string;
    contentBg: string;
    card: string;
    cardForeground: string;
    cardBorder: string;
    border: string;
    input: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    link: string;
    linkHover: string;
}
/**
 * 边框配置接口
 */
export interface BorderConfig {
    width: {
        none: string;
        thin: string;
        medium: string;
        thick: string;
    };
    style: {
        solid: string;
        dashed: string;
        dotted: string;
    };
    composite: {
        none: string;
        default: string;
        card: string;
        input: string;
        thick: string;
        dashed: string;
        dotted: string;
    };
    colors: {
        none: string;
        default: string;
        card: string;
        input: string;
        thick: string;
        dashed: string;
        dotted: string;
    };
}
/**
 * 主题配置接口
 */
export interface ThemeConfig {
    meta: {
        name: string;
        version: string;
        author: string;
        description: string;
        mode: 'light' | 'dark';
        type: 'default' | 'festival';
    };
    colors: {
        primary: ColorScale;
        secondary: ColorScale;
        success: ColorScale;
        warning: ColorScale;
        error: ColorScale;
        info: ColorScale;
        neutral: ColorScale;
        semantic: SemanticColors;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
    };
    typography: {
        fontFamily: {
            sans: string[];
            mono: string[];
        };
        fontSize: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
        };
        fontWeight: {
            light: number;
            normal: number;
            medium: number;
            semibold: number;
            bold: number;
        };
        lineHeight: {
            tight: number;
            normal: number;
            relaxed: number;
        };
    };
    borderRadius: {
        none: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        full: string;
    };
    borders?: BorderConfig;
    shadows: {
        none: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        inner: string;
    };
    animation: {
        duration: {
            fast: string;
            normal: string;
            slow: string;
        };
        easing: {
            default: string;
            in: string;
            out: string;
            inOut: string;
        };
    };
}
/**
 * 转换后的 Ant Design 主题配置
 */
export interface AntDesignTheme {
    token: Record<string, any>;
    components?: Record<string, any>;
}
/**
 * CSS Variables 映射
 */
export type CSSVariables = Record<string, string>;
/**
 * Tailwind 配置
 */
export interface TailwindTheme {
    theme: {
        extend: Record<string, any>;
    };
}
/**
 * 主题转换结果
 */
export interface TransformedTheme {
    antd: AntDesignTheme;
    cssVars: CSSVariables;
    tailwind: TailwindTheme;
}
//# sourceMappingURL=types.d.ts.map