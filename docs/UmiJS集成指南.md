# UmiJS 项目集成指南

> 完整的 UmiJS 项目集成步骤，帮助您快速将 `@km-design/theme-system` 集成到现有 UmiJS 项目中

## 📋 目录

- [快速开始](#快速开始)
- [完整集成步骤](#完整集成步骤)
- [样式迁移](#样式迁移)
- [常见问题](#常见问题)
- [验证集成](#验证集成)

---

## 🚀 快速开始

### 前置要求

- ✅ UmiJS 4.x 或更高版本
- ✅ React 18.x
- ✅ Ant Design 5.x（如果使用 Ant Design）

### 5 分钟快速集成

```bash
# 1. 安装主题包
pnpm add git+https://github.com/hjw472015868/theme.git#latest

# 2. 在 app.tsx 中导入样式和配置 Provider
# 3. 配置 Tailwind（如果使用）
# 4. 迁移现有样式
```

---

## 📦 完整集成步骤

### 步骤 1: 安装主题包

```bash
# 推荐使用 latest 标签（自动获取最新稳定版本）
pnpm add git+https://github.com/hjw472015868/theme.git#latest

# 或使用固定版本
pnpm add git+https://github.com/hjw472015868/theme.git#v1.0.0
```

### 步骤 2: 导入样式文件 ⚠️ 重要！

**这是最容易遗漏的步骤，必须导入样式文件才能正常使用！**

在 `app.tsx` 文件顶部导入样式：

```typescript
// app.tsx
import '@km-design/theme-system/index.css'; // ⚠️ 必须导入！
import { UmiThemeProvider } from '@km-design/theme-system';
```

**为什么必须导入？**

主题系统通过 CSS 变量（`var(--primary)`、`var(--background)` 等）工作，这些变量定义在 `index.css` 中。如果不导入，所有主题变量都不会生效。

### 步骤 3: 配置 ThemeProvider

在 `app.tsx` 的 `rootContainer` 函数中包裹应用：

```typescript
// app.tsx
import '@km-design/theme-system/index.css'; // 导入样式
import { UmiThemeProvider } from '@km-design/theme-system';

export function rootContainer(container: React.ReactElement) {
  return (
    <UmiThemeProvider
      defaultTheme="default"        // 默认主题名称
      enableStorage={true}          // 启用主题持久化（保存到 localStorage）
      storageKey="my-app-theme"    // localStorage 存储键名
    >
      {container}
    </UmiThemeProvider>
  );
}
```

**参数说明：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `defaultTheme` | `string` | `"default"` | 默认主题名称，可选：`default`、`dark`、`km-base` 等 |
| `enableStorage` | `boolean` | `true` | 是否将主题选择保存到 localStorage |
| `storageKey` | `string` | `"km-theme"` | localStorage 存储键名，不同项目可使用不同键名避免冲突 |

### 步骤 4: 配置 Tailwind CSS（如果使用）

如果项目使用 Tailwind CSS，需要在 `tailwind.config.js` 或 `tailwind.config.ts` 中配置主题变量。

**⚠️ 重要：** 只有配置了这些变量，Tailwind 类名（如 `bg-primary`、`text-foreground`、`p-md` 等）才能正确使用主题系统的颜色和间距。

#### 方式一：JavaScript 配置（tailwind.config.js）

```javascript
// tailwind.config.js
module.exports = {
  // 指定要扫描的文件路径
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
    './src/app.tsx',
  ],
  // 启用 class 模式的暗色主题（主题系统会自动切换）
  darkMode: 'class',
  theme: {
    extend: {
      // ========== 颜色配置 ==========
      colors: {
        // 语义化颜色（基础颜色，用于背景、文字等）
        background: 'var(--background)',           // 页面背景色
        foreground: 'var(--foreground)',           // 主要文字颜色
        card: {
          DEFAULT: 'var(--card)',                  // 卡片背景色
          foreground: 'var(--card-foreground)',     // 卡片文字颜色
        },
        border: 'var(--border)',                   // 边框颜色
        input: 'var(--input)',                      // 输入框边框颜色
        ring: 'var(--primary)',                    // 焦点环颜色（通常使用主色）
        
        // 静音/次要颜色
        muted: {
          DEFAULT: 'var(--muted)',                 // 静音背景色
          foreground: 'var(--muted-foreground)',   // 静音文字颜色
        },
        
        // 强调色
        accent: {
          DEFAULT: 'var(--accent)',                // 强调背景色
          foreground: 'var(--accent-foreground)',  // 强调文字颜色
        },
        
        // 危险/错误色
        destructive: {
          DEFAULT: 'var(--destructive)',           // 危险操作背景色
          foreground: 'var(--destructive-foreground)', // 危险操作文字颜色
        },
        
        // 品牌色梯度（主色）
        primary: {
          DEFAULT: 'var(--primary)',               // 主色（默认使用 500）
          foreground: 'var(--primary-foreground)', // 主色文字颜色
          50: 'var(--color-primary-50)',           // 最浅
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',          // 主色（常用）
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',         // 最深
        },
        
        // 辅助色梯度
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
        },
        
        // 成功色梯度
        success: {
          DEFAULT: 'var(--success)',
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          300: 'var(--color-success-300)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          800: 'var(--color-success-800)',
          900: 'var(--color-success-900)',
        },
        
        // 警告色梯度
        warning: {
          DEFAULT: 'var(--warning)',
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          300: 'var(--color-warning-300)',
          400: 'var(--color-warning-400)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
          800: 'var(--color-warning-800)',
          900: 'var(--color-warning-900)',
        },
        
        // 错误色梯度
        error: {
          DEFAULT: 'var(--error)',
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
        },
        
        // 信息色梯度
        info: {
          DEFAULT: 'var(--info)',
          50: 'var(--color-info-50)',
          100: 'var(--color-info-100)',
          200: 'var(--color-info-200)',
          300: 'var(--color-info-300)',
          400: 'var(--color-info-400)',
          500: 'var(--color-info-500)',
          600: 'var(--color-info-600)',
          700: 'var(--color-info-700)',
          800: 'var(--color-info-800)',
          900: 'var(--color-info-900)',
        },
        
        // 中性色梯度（灰色系）
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
      },
      
      // ========== 间距配置 ==========
      spacing: {
        xs: 'var(--spacing-xs)',      // 超小间距（通常 4px）
        sm: 'var(--spacing-sm)',      // 小间距（通常 8px）
        md: 'var(--spacing-md)',      // 中等间距（通常 16px）
        lg: 'var(--spacing-lg)',      // 大间距（通常 24px）
        xl: 'var(--spacing-xl)',      // 超大间距（通常 32px）
        '2xl': 'var(--spacing-2xl)',  // 2倍大间距（通常 48px）
        '3xl': 'var(--spacing-3xl)',  // 3倍大间距（通常 64px）
      },
      
      // ========== 圆角配置 ==========
      borderRadius: {
        none: 'var(--radius-none)',   // 无圆角
        sm: 'var(--radius-sm)',        // 小圆角（通常 2px）
        md: 'var(--radius-md)',        // 中等圆角（通常 4px）
        lg: 'var(--radius-lg)',        // 大圆角（通常 8px）
        xl: 'var(--radius-xl)',        // 超大圆角（通常 12px）
        '2xl': 'var(--radius-2xl)',   // 2倍大圆角（通常 16px）
        full: 'var(--radius-full)',   // 完全圆形（9999px）
      },
      
      // ========== 字体配置 ==========
      fontFamily: {
        sans: 'var(--font-family-sans)',  // 无衬线字体（默认字体）
        mono: 'var(--font-family-mono)',  // 等宽字体（代码字体）
      },
      fontSize: {
        xs: 'var(--font-size-xs)',        // 超小字体
        sm: 'var(--font-size-sm)',        // 小字体
        base: 'var(--font-size-base)',    // 基础字体（默认）
        lg: 'var(--font-size-lg)',        // 大字体
        xl: 'var(--font-size-xl)',        // 超大字体
        '2xl': 'var(--font-size-2xl)',    // 2倍大字体
        '3xl': 'var(--font-size-3xl)',    // 3倍大字体
        '4xl': 'var(--font-size-4xl)',   // 4倍大字体
      },
      fontWeight: {
        light: 'var(--font-weight-light)',     // 细体（300）
        normal: 'var(--font-weight-normal)',   // 常规（400）
        medium: 'var(--font-weight-medium)',   // 中等（500）
        semibold: 'var(--font-weight-semibold)', // 半粗（600）
        bold: 'var(--font-weight-bold)',        // 粗体（700）
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',     // 紧凑行高
        normal: 'var(--line-height-normal)',   // 正常行高
        relaxed: 'var(--line-height-relaxed)', // 宽松行高
      },
      
      // ========== 阴影配置 ==========
      boxShadow: {
        none: 'var(--shadow-none)',    // 无阴影
        sm: 'var(--shadow-sm)',         // 小阴影
        md: 'var(--shadow-md)',         // 中等阴影
        lg: 'var(--shadow-lg)',         // 大阴影
        xl: 'var(--shadow-xl)',        // 超大阴影
        '2xl': 'var(--shadow-2xl)',    // 2倍大阴影
        inner: 'var(--shadow-inner)',  // 内阴影
      },
      
      // ========== 边框配置 ==========
      borderWidth: {
        none: 'var(--border-width-none)',   // 无边框
        thin: 'var(--border-width-thin)',   // 细边框（通常 1px）
        medium: 'var(--border-width-medium)', // 中等边框（通常 2px）
        thick: 'var(--border-width-thick)', // 粗边框（通常 3px）
      },
      
      // ========== 动画配置 ==========
      transitionDuration: {
        fast: 'var(--animation-duration-fast)',     // 快速动画
        normal: 'var(--animation-duration-normal)', // 正常动画
        slow: 'var(--animation-duration-slow)',     // 慢速动画
      },
      transitionTimingFunction: {
        default: 'var(--animation-easing-default)', // 默认缓动
        in: 'var(--animation-easing-in)',          // 缓入
        out: 'var(--animation-easing-out)',       // 缓出
        'in-out': 'var(--animation-easing-inOut)', // 缓入缓出
      },
    },
  },
  plugins: [],
};
```

#### 方式二：TypeScript 配置（tailwind.config.ts）

如果项目使用 TypeScript，可以使用以下配置：

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  // 指定要扫描的文件路径
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
    './src/app.tsx',
  ],
  // 启用 class 模式的暗色主题
  darkMode: 'class',
  theme: {
    extend: {
      // ========== 颜色配置 ==========
      colors: {
        // 语义化颜色
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--primary)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        
        // 品牌色梯度
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
        },
        success: {
          DEFAULT: 'var(--success)',
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          300: 'var(--color-success-300)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          800: 'var(--color-success-800)',
          900: 'var(--color-success-900)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          300: 'var(--color-warning-300)',
          400: 'var(--color-warning-400)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
          800: 'var(--color-warning-800)',
          900: 'var(--color-warning-900)',
        },
        error: {
          DEFAULT: 'var(--error)',
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
        },
        info: {
          DEFAULT: 'var(--info)',
          50: 'var(--color-info-50)',
          100: 'var(--color-info-100)',
          200: 'var(--color-info-200)',
          300: 'var(--color-info-300)',
          400: 'var(--color-info-400)',
          500: 'var(--color-info-500)',
          600: 'var(--color-info-600)',
          700: 'var(--color-info-700)',
          800: 'var(--color-info-800)',
          900: 'var(--color-info-900)',
        },
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
      },
      
      // ========== 间距配置 ==========
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      
      // ========== 圆角配置 ==========
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      
      // ========== 字体配置 ==========
      fontFamily: {
        sans: 'var(--font-family-sans)',
        mono: 'var(--font-family-mono)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      fontWeight: {
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },
      
      // ========== 阴影配置 ==========
      boxShadow: {
        none: 'var(--shadow-none)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
      },
      
      // ========== 边框配置 ==========
      borderWidth: {
        none: 'var(--border-width-none)',
        thin: 'var(--border-width-thin)',
        medium: 'var(--border-width-medium)',
        thick: 'var(--border-width-thick)',
      },
      
      // ========== 动画配置 ==========
      transitionDuration: {
        fast: 'var(--animation-duration-fast)',
        normal: 'var(--animation-duration-normal)',
        slow: 'var(--animation-duration-slow)',
      },
      transitionTimingFunction: {
        default: 'var(--animation-easing-default)',
        in: 'var(--animation-easing-in)',
        out: 'var(--animation-easing-out)',
        'in-out': 'var(--animation-easing-inOut)',
      },
    },
  },
  plugins: [],
};

export default config;
```

#### 配置说明

**为什么需要这些配置？**

1. **颜色映射**：将 Tailwind 的颜色类名（如 `bg-primary`、`text-foreground`）映射到主题系统的 CSS 变量
2. **间距映射**：将 Tailwind 的间距类名（如 `p-md`、`m-lg`）映射到主题系统的间距变量
3. **圆角映射**：将 Tailwind 的圆角类名（如 `rounded-md`）映射到主题系统的圆角变量
4. **字体映射**：将 Tailwind 的字体类名映射到主题系统的字体变量
5. **阴影映射**：将 Tailwind 的阴影类名（如 `shadow-md`）映射到主题系统的阴影变量

**配置后可以使用的 Tailwind 类名示例：**

```tsx
// 颜色
<div className="bg-background text-foreground">背景和文字</div>
<div className="bg-card text-card-foreground">卡片</div>
<div className="bg-primary text-primary-foreground">主色</div>
<div className="bg-primary-500">主色 500</div>
<div className="border border-border">边框</div>

// 间距
<div className="p-md m-lg">内边距和外边距</div>
<div className="px-sm py-md">水平垂直间距</div>

// 圆角
<button className="rounded-md">中等圆角</button>
<div className="rounded-lg">大圆角</div>

// 字体
<p className="text-base font-medium">基础字体</p>
<p className="text-lg font-bold">大号粗体</p>

// 阴影
<div className="shadow-md">中等阴影</div>
<div className="shadow-lg">大阴影</div>
```

**⚠️ 注意事项：**

- 配置后需要重启开发服务器才能生效
- 如果某些类名不生效，检查 `content` 配置是否包含对应的文件路径
- 确保已导入主题系统的样式文件（`@km-design/theme-system/index.css`）

### 步骤 5: 在组件中使用

#### 5.1 使用主题 Hook

```typescript
// src/components/Header.tsx
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';

export default function Header() {
  const { 
    currentTheme,      // 当前主题名称
    switchTheme,       // 切换主题函数
    availableThemes,   // 可用主题列表
    themeConfig,       // 完整主题配置对象
    isDarkMode,        // 是否为暗色模式
  } = useTheme();

  return (
    <header style={{
      background: 'var(--card)',
      padding: 'var(--spacing-md)',
      color: 'var(--foreground)',
    }}>
      <div>我的应用</div>
      
      {/* 使用内置主题切换器 */}
      <ThemeSwitcher />
      
      {/* 或自定义切换逻辑 */}
      <div>
        {availableThemes.map(theme => (
          <button 
            key={theme} 
            onClick={() => switchTheme(theme)}
            style={{
              background: currentTheme === theme ? 'var(--primary)' : 'transparent',
              color: currentTheme === theme ? 'var(--primary-foreground)' : 'var(--foreground)',
            }}
          >
            {theme}
          </button>
        ))}
      </div>
      
      <p>当前主题: {currentTheme}</p>
      {isDarkMode && <span>🌙 暗色模式</span>}
    </header>
  );
}
```

#### 5.2 使用 CSS Variables（推荐）

在组件样式中直接使用 CSS 变量：

```typescript
// src/components/Card.tsx
export default function Card({ children }) {
  return (
    <div 
      className="card"
      style={{
        background: 'var(--card)',
        color: 'var(--card-foreground)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {children}
    </div>
  );
}
```

或使用 Tailwind 类名：

```tsx
<div className="bg-card text-card-foreground border border-border rounded-md p-md shadow-md">
  {children}
</div>
```

#### 5.3 使用 Tailwind 类名

```tsx
// 背景色
<div className="bg-background">背景</div>
<div className="bg-card">卡片背景</div>
<div className="bg-primary">主色背景</div>

// 文字颜色
<p className="text-foreground">前景色</p>
<p className="text-primary">主色文字</p>

// 间距
<div className="p-md">中等内边距</div>
<div className="m-lg">大外边距</div>

// 圆角
<button className="rounded-md">中等圆角</button>
```

---

## 🎨 样式迁移

### 为什么需要迁移？

主题系统通过 **CSS 变量** 工作，只有将硬编码的颜色、间距等改为 CSS 变量，才能在主题配置中心统一调整。

### 迁移对照表

| 原写法 | 迁移写法 | 说明 |
|--------|----------|------|
| `background: #ffffff` | `background: var(--background)` | 背景色 |
| `color: #000000` | `color: var(--foreground)` | 文字颜色 |
| `border: 1px solid #e0e0e0` | `border: 1px solid var(--border)` | 边框 |
| `padding: 16px` | `padding: var(--spacing-md)` | 间距 |
| `border-radius: 8px` | `border-radius: var(--radius-md)` | 圆角 |
| `box-shadow: 0 2px 8px rgba(0,0,0,0.1)` | `box-shadow: var(--shadow-md)` | 阴影 |

### 迁移步骤

1. **识别硬编码样式**
   - 搜索项目中的颜色值（`#ffffff`、`rgb()`、`rgba()`）
   - 搜索固定间距值（`16px`、`24px` 等）
   - 搜索固定圆角值（`4px`、`8px` 等）

2. **替换为 CSS 变量**
   - 背景色 → `var(--background)`、`var(--card)` 等
   - 文字颜色 → `var(--foreground)`、`var(--card-foreground)` 等
   - 主色 → `var(--primary)`、`var(--color-primary-500)` 等
   - 间距 → `var(--spacing-xs)`、`var(--spacing-md)` 等
   - 圆角 → `var(--radius-sm)`、`var(--radius-md)` 等

3. **验证迁移效果**
   - 打开主题配置中心
   - 修改主题颜色
   - 检查页面样式是否同步更新

**详细迁移指南：** 参考 [样式迁移指南.md](./样式迁移指南.md)

---

## ❓ 常见问题

### Q1: 导入样式后报错 "Module not found: Package path ./index.css is not exported"

**原因：** 包的 `exports` 字段未正确配置样式文件导出。

**解决方案：**

1. 确保使用最新版本的主题包（`#latest` 标签）
2. 如果仍报错，检查 `node_modules/@km-design/theme-system/package.json` 中的 `exports` 字段是否包含：
   ```json
   {
     "exports": {
       ".": { ... },
       "./index.css": "./dist/index.css"
     }
   }
   ```
3. 如果缺失，请更新到最新版本或联系维护者

### Q2: 主题切换后样式没有更新

**可能原因：**

1. ❌ **未导入样式文件** - 必须导入 `@km-design/theme-system/index.css`
2. ❌ **使用了硬编码颜色** - 需要改为 CSS 变量
3. ❌ **Tailwind 未配置** - 如果使用 Tailwind，需要配置主题变量

**检查清单：**

- [ ] 已导入 `@km-design/theme-system/index.css`
- [ ] 已配置 `UmiThemeProvider`
- [ ] 样式使用 CSS 变量而非硬编码
- [ ] Tailwind 配置正确（如果使用）

### Q3: 如何自定义主题？

**方式一：使用主题配置中心（推荐）**

1. 在组件中使用 `ThemeEditor`：
   ```tsx
   import { ThemeEditor } from '@km-design/theme-system';
   
   const [editorOpen, setEditorOpen] = useState(false);
   
   <ThemeEditor open={editorOpen} onClose={() => setEditorOpen(false)} />
   ```

2. 打开配置中心，修改颜色、间距等
3. 点击"保存为新主题"或"完成"保存

**方式二：创建自定义主题 JSON**

1. 参考 `presets/` 目录下的主题文件格式
2. 创建自己的主题 JSON 文件
3. 使用 `registerTheme` 注册：
   ```tsx
   import { registerTheme } from '@km-design/theme-system';
   import myTheme from './my-theme.json';
   
   registerTheme('my-theme', myTheme);
   ```

### Q4: 如何获取主题的特定颜色值？

```typescript
import { useTheme } from '@km-design/theme-system';

function MyComponent() {
  const { themeConfig } = useTheme();
  
  // 获取主色 500
  const primaryColor = themeConfig?.colors?.primary?.[500];
  
  // 获取背景色
  const backgroundColor = themeConfig?.colors?.semantic?.background;
  
  // 获取间距
  const spacingMd = themeConfig?.spacing?.md;
}
```

### Q5: 如何禁用主题持久化？

```typescript
<UmiThemeProvider
  defaultTheme="default"
  enableStorage={false}  // 禁用持久化
>
  {container}
</UmiThemeProvider>
```

### Q6: 如何在不同页面使用不同主题？

主题系统是全局的，不支持页面级主题。如果需要，可以：

1. 使用主题配置中心创建多个主题
2. 在特定页面切换主题：
   ```tsx
   useEffect(() => {
     switchTheme('dark-theme');
     return () => switchTheme('default'); // 离开时恢复
   }, []);
   ```

---

## ✅ 验证集成

### 1. 检查样式是否生效

打开浏览器开发者工具，检查 `:root` 元素是否有 CSS 变量：

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #1890ff;
  /* ... 更多变量 */
}
```

### 2. 测试主题切换

1. 在组件中使用 `ThemeSwitcher` 或调用 `switchTheme()`
2. 检查页面样式是否实时更新
3. 刷新页面，检查主题是否保持（如果启用了 `enableStorage`）

### 3. 测试主题配置中心

1. 打开主题配置中心（使用 `ThemeEditor` 组件）
2. 修改颜色、间距等配置
3. 检查页面是否实时更新
4. 保存为新主题，检查是否成功

### 4. 检查控制台错误

打开浏览器控制台，确保没有以下错误：

- ❌ `Module not found: Package path ./index.css is not exported`
- ❌ `Cannot read property 'colors' of undefined`
- ❌ `ThemeProvider must be used within ThemeProvider`

---

## 📚 相关文档

- [使用指南.md](./使用指南.md) - 完整的使用说明和 API 文档
- [样式迁移指南.md](./样式迁移指南.md) - 详细的样式迁移步骤和对照表
- [开发工作流程.md](./开发工作流程.md) - 主题包的开发和发布流程
- [添加新主题指南.md](./添加新主题指南.md) - 如何添加自定义主题

---

## 🎯 集成检查清单

在完成集成后，请确认以下项目：

- [ ] 已安装主题包（`pnpm add git+https://github.com/hjw472015868/theme.git#latest`）
- [ ] 已导入样式文件（`import '@km-design/theme-system/index.css'`）
- [ ] 已配置 `UmiThemeProvider` 包裹应用
- [ ] 已配置 Tailwind CSS（如果使用）
- [ ] 已迁移硬编码样式为 CSS 变量
- [ ] 主题切换功能正常
- [ ] 主题持久化正常（刷新后保持）
- [ ] 主题配置中心可以正常使用
- [ ] 控制台无错误信息

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0

