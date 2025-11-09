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
  500: string; // 主色调
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
  // 背景色
  background: string; // 页面背景
  foreground: string; // 主文字颜色
  contentBg: string; // 主内容区背景（可独立配置）

  // 卡片
  card: string; // 卡片背景
  cardForeground: string; // 卡片文字
  cardBorder: string; // 卡片边框

  // 边框
  border: string; // 通用边框
  input: string; // 输入框边框

  // 静音/禁用
  muted: string; // 静音背景
  mutedForeground: string; // 静音文字

  // 强调色
  accent: string; // 强调背景
  accentForeground: string; // 强调文字

  // 破坏性操作
  destructive: string; // 删除/危险操作背景
  destructiveForeground: string; // 删除/危险操作文字

  // 链接
  link: string; // 链接颜色
  linkHover: string; // 链接悬停
}

/**
 * 边框配置接口
 */
export interface BorderConfig {
  // 边框宽度
  width: {
    none: string; // 0
    thin: string; // 1px
    medium: string; // 2px
    thick: string; // 3px
  };
  // 边框样式
  style: {
    solid: string; // solid
    dashed: string; // dashed
    dotted: string; // dotted
  };
  // 组合配置（宽度 + 样式，不含颜色）
  composite: {
    none: string; // 0
    default: string; // 1px solid
    card: string; // 1px solid
    input: string; // 1px solid
    thick: string; // 2px solid
    dashed: string; // 1px dashed
    dotted: string; // 1px dotted
  };
  // 边框颜色（每个边框独立的颜色）
  colors: {
    none: string; // 无边框的颜色（虽然不显示）
    default: string; // 默认边框颜色
    card: string; // 卡片边框颜色
    input: string; // 输入框边框颜色
    thick: string; // 加粗边框颜色
    dashed: string; // 虚线边框颜色
    dotted: string; // 点线边框颜色
  };
}

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  // 元信息
  meta: {
    name: string; // 主题名称
    version: string; // 版本号
    author: string; // 作者
    description: string; // 描述
    mode: 'light' | 'dark'; // 主题模式
    type: 'default' | 'festival'; // 主题类型
  };

  // 颜色系统
  colors: {
    // 品牌色
    primary: ColorScale;
    secondary: ColorScale;

    // 功能色
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
    info: ColorScale;

    // 中性色
    neutral: ColorScale;

    // 语义化颜色
    semantic: SemanticColors;
  };

  // 间距系统
  spacing: {
    xs: string; // 4px
    sm: string; // 8px
    md: string; // 16px
    lg: string; // 24px
    xl: string; // 32px
    '2xl': string; // 48px
    '3xl': string; // 64px
  };

  // 字体系统
  typography: {
    fontFamily: {
      sans: string[]; // 无衬线字体
      mono: string[]; // 等宽字体
    };
    fontSize: {
      xs: string; // 12px
      sm: string; // 14px
      base: string; // 16px
      lg: string; // 18px
      xl: string; // 20px
      '2xl': string; // 24px
      '3xl': string; // 30px
      '4xl': string; // 36px
    };
    fontWeight: {
      light: number; // 300
      normal: number; // 400
      medium: number; // 500
      semibold: number; // 600
      bold: number; // 700
    };
    lineHeight: {
      tight: number; // 1.25
      normal: number; // 1.5
      relaxed: number; // 1.75
    };
  };

  // 圆角系统
  borderRadius: {
    none: string; // 0
    sm: string; // 4px
    md: string; // 8px
    lg: string; // 12px
    xl: string; // 16px
    '2xl': string; // 24px
    full: string; // 9999px
  };

  // 边框系统（可选，向后兼容）
  borders?: BorderConfig;

  // 阴影系统
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };

  // 动画时长
  animation: {
    duration: {
      fast: string; // 150ms
      normal: string; // 300ms
      slow: string; // 500ms
    };
    easing: {
      default: string; // cubic-bezier(0.4, 0, 0.2, 1)
      in: string; // cubic-bezier(0.4, 0, 1, 1)
      out: string; // cubic-bezier(0, 0, 0.2, 1)
      inOut: string; // cubic-bezier(0.4, 0, 0.2, 1)
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

