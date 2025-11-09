/**
 * 主题转换器
 * 将 Design Tokens 转换为 Ant Design、Tailwind CSS 和 CSS Variables
 */

import type {
  ThemeConfig,
  AntDesignTheme,
  CSSVariables,
  TailwindTheme,
  TransformedTheme,
  ColorScale,
} from '../tokens/types';

/**
 * 主题转换器类
 */
export class ThemeTransformer {
  private config: ThemeConfig;

  constructor(config: ThemeConfig) {
    this.config = config;
  }

  /**
   * 转换为 Ant Design ConfigProvider 配置
   */
  public toAntdTheme(): AntDesignTheme {
    const { colors, spacing, typography, borderRadius, borders, shadows, animation } = this.config;

    return {
      token: {
        // === 颜色 ===
        colorPrimary: colors.primary[500],
        colorSuccess: colors.success[500],
        colorWarning: colors.warning[500],
        colorError: colors.error[500],
        colorInfo: colors.info[500],

        // 文字颜色
        colorText: colors.semantic.foreground,
        colorTextSecondary: colors.semantic.mutedForeground,
        colorTextDisabled: colors.neutral[400],
        colorTextPlaceholder: colors.neutral[400],

        // 背景色
        colorBgContainer: colors.semantic.background,
        colorBgElevated: colors.semantic.card,
        colorBgLayout: colors.semantic.muted,
        colorBgSpotlight: colors.semantic.accent,

        // 边框
        colorBorder: colors.semantic.border,
        colorBorderSecondary: colors.neutral[200],

        // 链接
        colorLink: colors.semantic.link,
        colorLinkHover: colors.semantic.linkHover,
        colorLinkActive: colors.primary[700],

        // === 字体 ===
        fontFamily: typography.fontFamily.sans.join(', '),
        fontSize: parseInt(typography.fontSize.base),
        fontSizeSM: parseInt(typography.fontSize.sm),
        fontSizeLG: parseInt(typography.fontSize.lg),
        fontSizeXL: parseInt(typography.fontSize.xl),
        fontSizeHeading1: parseInt(typography.fontSize['4xl']),
        fontSizeHeading2: parseInt(typography.fontSize['3xl']),
        fontSizeHeading3: parseInt(typography.fontSize['2xl']),
        fontSizeHeading4: parseInt(typography.fontSize.xl),
        fontSizeHeading5: parseInt(typography.fontSize.lg),

        fontWeightStrong: typography.fontWeight.semibold,

        // 行高
        lineHeight: typography.lineHeight.normal,
        lineHeightSM: typography.lineHeight.tight,
        lineHeightLG: typography.lineHeight.relaxed,

        // === 圆角 ===
        borderRadius: parseInt(borderRadius.md),
        borderRadiusLG: parseInt(borderRadius.lg),
        borderRadiusSM: parseInt(borderRadius.sm),
        borderRadiusXS: parseInt(borderRadius.sm),
        borderRadiusOuter: parseInt(borderRadius.md),

        // === 间距 ===
        padding: parseInt(spacing.md),
        paddingLG: parseInt(spacing.lg),
        paddingSM: parseInt(spacing.sm),
        paddingXS: parseInt(spacing.xs),
        paddingXL: parseInt(spacing.xl),

        margin: parseInt(spacing.md),
        marginLG: parseInt(spacing.lg),
        marginSM: parseInt(spacing.sm),
        marginXS: parseInt(spacing.xs),
        marginXL: parseInt(spacing.xl),

        // === 阴影 ===
        boxShadow: shadows.md,
        boxShadowSecondary: shadows.sm,

        // === 动画 ===
        motionDurationFast: animation.duration.fast,
        motionDurationMid: animation.duration.normal,
        motionDurationSlow: animation.duration.slow,

        // === 暗色模式 ===
        // 根据主题模式自动调整
        ...(this.config.meta.mode === 'dark'
          ? {
              colorBgBase: colors.semantic.background,
              colorTextBase: colors.semantic.foreground,
            }
          : {}),
      },

      components: {
        // Button 组件
        Button: {
          primaryShadow: shadows.sm,
          dangerShadow: shadows.sm,
          colorPrimary: colors.primary[500],
          colorPrimaryHover: colors.primary[400],
          colorPrimaryActive: colors.primary[600],
        },

        // Card 组件
        Card: {
          colorBorderSecondary: colors.semantic.cardBorder,
          boxShadowTertiary: shadows.md,
        },

        // Menu 组件（侧边栏菜单）
        Menu: {
          colorBgContainer: colors.semantic.card,
          colorItemBg: colors.semantic.card,
          colorItemBgHover: colors.semantic.muted,
          colorItemBgActive: colors.semantic.accent,
          colorItemBgSelected: colors.semantic.accent,
          colorItemText: colors.semantic.foreground,
          colorItemTextHover: colors.semantic.foreground,
          colorItemTextSelected: colors.semantic.accentForeground,
          colorItemTextActive: colors.semantic.accentForeground,
          colorSubItemBg: colors.semantic.card,
          colorActiveBarBorderSize: 0,
        },

        // Table 组件
        Table: {
          colorBgContainer: colors.semantic.card,
          colorBorderSecondary: colors.semantic.border,
          colorTextHeading: colors.semantic.foreground,
          colorText: colors.semantic.foreground,
          colorTextDescription: colors.semantic.mutedForeground,
          colorFillAlter: colors.semantic.muted,
          colorSplit: colors.semantic.border,
        },

        // Input 组件
        Input: {
          colorBgContainer: colors.semantic.background,
          colorBorder: colors.semantic.input,
          colorText: colors.semantic.foreground,
          colorTextPlaceholder: colors.semantic.mutedForeground,
          colorBgContainerDisabled: colors.semantic.muted,
        },

        // Select 组件
        Select: {
          colorBgContainer: colors.semantic.background,
          colorBgElevated: colors.semantic.card,
          colorBorder: colors.semantic.border,
          colorText: colors.semantic.foreground,
          colorTextPlaceholder: colors.semantic.mutedForeground,
        },

        // Modal 组件
        Modal: {
          colorBgElevated: colors.semantic.card,
        },

        // Message 组件
        Message: {
          contentBg: colors.semantic.card,
        },

        // Notification 组件
        Notification: {
          colorBgElevated: colors.semantic.card,
        },

        // Tabs 组件
        Tabs: {
          colorBorderSecondary: colors.semantic.border,
        },

        // Layout 组件
        Layout: {
          colorBgHeader: colors.semantic.card,
          colorBgBody: colors.semantic.background,
          colorBgTrigger: colors.semantic.muted,
          siderBg: colors.semantic.card,
        },

        // Dropdown 组件
        Dropdown: {
          colorBgElevated: colors.semantic.card,
          colorText: colors.semantic.foreground,
        },

        // Pagination 组件
        Pagination: {
          colorBgContainer: colors.semantic.card,
          colorText: colors.semantic.foreground,
          colorTextDisabled: colors.semantic.mutedForeground,
        },

        // Switch 组件
        Switch: {
          colorTextQuaternary: colors.neutral[400],
          colorTextTertiary: colors.neutral[500],
        },

        // Tag 组件
        Tag: {
          colorBorder: colors.semantic.border,
          colorText: colors.semantic.foreground,
        },
      },
    };
  }

  /**
   * 转换为 CSS Variables
   */
  public toCSSVariables(): CSSVariables {
    const { colors, spacing, typography, borderRadius, borders, shadows, animation } = this.config;
    const vars: CSSVariables = {};

    // === 颜色变量 ===
    // 品牌色
    this.addColorScale(vars, 'primary', colors.primary);
    this.addColorScale(vars, 'secondary', colors.secondary);

    // 功能色
    this.addColorScale(vars, 'success', colors.success);
    this.addColorScale(vars, 'warning', colors.warning);
    this.addColorScale(vars, 'error', colors.error);
    this.addColorScale(vars, 'info', colors.info);

    // 中性色
    this.addColorScale(vars, 'neutral', colors.neutral);
    
    // 简短格式的主色（指向 500 级别）
    vars['--primary'] = colors.primary[500];
    vars['--secondary'] = colors.secondary[500];
    vars['--success'] = colors.success[500];
    vars['--warning'] = colors.warning[500];
    vars['--error'] = colors.error[500];
    vars['--destructive'] = colors.error[500]; // 别名
    vars['--info'] = colors.info[500];

    // 语义化颜色（使用简短的变量名，方便使用）
    Object.entries(colors.semantic).forEach(([key, value]) => {
      const kebabKey = this.camelToKebab(key);
      vars[`--${kebabKey}`] = value; // 简短格式：--background
      vars[`--color-${kebabKey}`] = value; // 完整格式：--color-background（兼容）
    });

    // === 间距变量 ===
    Object.entries(spacing).forEach(([key, value]) => {
      vars[`--spacing-${key}`] = value;
    });

    // === 字体变量 ===
    vars['--font-family'] = typography.fontFamily.sans.join(', '); // 简短格式
    vars['--font-family-sans'] = typography.fontFamily.sans.join(', ');
    vars['--font-family-mono'] = typography.fontFamily.mono.join(', ');

    Object.entries(typography.fontSize).forEach(([key, value]) => {
      vars[`--font-size-${key}`] = value;
    });

    Object.entries(typography.fontWeight).forEach(([key, value]) => {
      vars[`--font-weight-${key}`] = String(value);
    });

    Object.entries(typography.lineHeight).forEach(([key, value]) => {
      vars[`--line-height-${key}`] = String(value);
    });

    // === 圆角变量 ===
    Object.entries(borderRadius).forEach(([key, value]) => {
      vars[`--radius-${key}`] = value; // 简短格式：--radius-md
      vars[`--border-radius-${key}`] = value; // 完整格式（兼容）
    });

    // === 边框变量 ===
    if (borders) {
      // 边框宽度
      Object.entries(borders.width).forEach(([key, value]) => {
        vars[`--border-width-${key}`] = value;
      });

      // 边框样式
      Object.entries(borders.style).forEach(([key, value]) => {
        vars[`--border-style-${key}`] = value;
      });

      // 组合边框（宽度 + 样式）
      Object.entries(borders.composite).forEach(([key, value]) => {
        vars[`--border-${key}`] = value;
      });

      // 边框颜色
      if (borders.colors) {
        Object.entries(borders.colors).forEach(([key, value]) => {
          vars[`--border-color-${key}`] = value;
        });
      }

      // 完整边框定义（宽度 + 样式 + 颜色）
      if (borders.colors) {
        Object.entries(borders.composite).forEach(([key, value]) => {
          const color = borders.colors![key as keyof typeof borders.colors];
          vars[`--border-full-${key}`] = value === '0' ? 'none' : `${value} ${color}`;
        });
      }
    }

    // === 阴影变量 ===
    Object.entries(shadows).forEach(([key, value]) => {
      vars[`--shadow-${key}`] = value;
    });

    // === 动画变量 ===
    Object.entries(animation.duration).forEach(([key, value]) => {
      vars[`--animation-duration-${key}`] = value;
    });

    Object.entries(animation.easing).forEach(([key, value]) => {
      vars[`--animation-easing-${key}`] = value;
    });

    return vars;
  }

  /**
   * 转换为 Tailwind CSS 配置
   */
  public toTailwindConfig(): TailwindTheme {
    const { colors, spacing, typography, borderRadius, borders, shadows } = this.config;

    return {
      theme: {
        extend: {
          // 颜色扩展
          colors: {
            primary: this.colorScaleToObject(colors.primary),
            secondary: this.colorScaleToObject(colors.secondary),
            success: this.colorScaleToObject(colors.success),
            warning: this.colorScaleToObject(colors.warning),
            error: this.colorScaleToObject(colors.error),
            info: this.colorScaleToObject(colors.info),
            neutral: this.colorScaleToObject(colors.neutral),

            // 语义化颜色（使用 CSS Variables）
            background: 'var(--color-background)',
            foreground: 'var(--color-foreground)',
            'content-bg': 'var(--color-content-bg)',
            card: 'var(--color-card)',
            'card-foreground': 'var(--color-card-foreground)',
            'card-border': 'var(--color-card-border)',
            border: 'var(--color-border)',
            input: 'var(--color-input)',
            muted: 'var(--color-muted)',
            'muted-foreground': 'var(--color-muted-foreground)',
            accent: 'var(--color-accent)',
            'accent-foreground': 'var(--color-accent-foreground)',
            destructive: 'var(--color-destructive)',
            'destructive-foreground': 'var(--color-destructive-foreground)',
            link: 'var(--color-link)',
            'link-hover': 'var(--color-link-hover)',
          },

          // 间距扩展
          spacing: {
            ...spacing,
          },

          // 字体扩展
          fontFamily: {
            sans: typography.fontFamily.sans,
            mono: typography.fontFamily.mono,
          },

          fontSize: {
            ...typography.fontSize,
          },

          fontWeight: {
            ...typography.fontWeight,
          },

          lineHeight: {
            ...typography.lineHeight,
          },

          // 圆角扩展
          borderRadius: {
            ...borderRadius,
          },

          // 边框宽度扩展
          ...(borders && {
            borderWidth: {
              ...borders.width,
            },
          }),

          // 边框样式（Tailwind 原生支持，仅作为参考）
          // borderStyle: solid, dashed, dotted, double, none

          // 阴影扩展
          boxShadow: {
            ...shadows,
          },
        },
      },
    };
  }

  /**
   * 转换所有格式
   */
  public transformAll(): TransformedTheme {
    return {
      antd: this.toAntdTheme(),
      cssVars: this.toCSSVariables(),
      tailwind: this.toTailwindConfig(),
    };
  }

  // === 辅助方法 ===

  /**
   * 驼峰转短横线
   */
  private camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }

  /**
   * 添加颜色梯度到 CSS Variables
   */
  private addColorScale(vars: CSSVariables, name: string, scale: ColorScale): void {
    Object.entries(scale).forEach(([key, value]) => {
      vars[`--color-${name}-${key}`] = value;
    });
  }

  /**
   * 颜色梯度转对象
   */
  private colorScaleToObject(scale: ColorScale): Record<string, string> {
    return { ...scale, DEFAULT: scale[500] };
  }
}

/**
 * 快捷函数：从主题配置生成所有需要的输出
 */
export function transformTheme(config: ThemeConfig): TransformedTheme {
  const transformer = new ThemeTransformer(config);
  return transformer.transformAll();
}

/**
 * 应用 CSS Variables 到文档
 */
export function applyCSSVariables(cssVars: CSSVariables): void {
  Object.entries(cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

/**
 * 从 JSON 加载主题配置
 */
export async function loadThemeFromJSON(jsonPath: string): Promise<ThemeConfig> {
  const response = await fetch(jsonPath);
  const config = await response.json();
  return config as ThemeConfig;
}

