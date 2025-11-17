# Next.js 项目集成指南

> 完整的 Next.js 项目集成步骤，帮助您快速将 `@km-design/theme-system` 集成到现有 Next.js 项目中

## 📋 目录

- [快速开始](#快速开始)
- [完整集成步骤](#完整集成步骤)
- [样式迁移](#样式迁移)
- [常见问题](#常见问题)
- [验证集成](#验证集成)

---

## 🚀 快速开始

### 前置要求

- ✅ Next.js 13.x 或更高版本（App Router）
- ✅ React 18.x
- ✅ Ant Design 5.x（如果使用 Ant Design）
- ✅ Tailwind CSS 3.x（如果使用 Tailwind）

### 5 分钟快速集成

```bash
# 1. 安装主题包
pnpm add -E "@km-design/theme-system@git+https://github.com/hjw472015868/theme.git#v1.0.6"

# 2. 创建 ThemeWrapper 组件
# 3. 在 layout.tsx 中注入 Provider
# 4. 创建 ThemeControl 组件并集成到导航栏
# 5. 配置 Tailwind CSS
# 6. 迁移现有样式
```

---

## 📦 完整集成步骤

### 步骤 1: 安装主题包

```bash
# 推荐使用固定版本（当前最新为 v1.0.6）
pnpm add -E "@km-design/theme-system@git+https://github.com/hjw472015868/theme.git#v1.0.6"

# 或使用 latest 标签（自动获取最新稳定版本）
pnpm add -E "@km-design/theme-system@git+https://github.com/hjw472015868/theme.git#latest"
```

**验证安装：**

安装完成后，检查 `node_modules/@km-design/theme-system` 目录是否存在，并确认 `package.json` 中已添加依赖。

### 步骤 2: 导入样式文件 ⚠️ 重要！

**这是最容易遗漏的步骤，必须导入样式文件才能正常使用！**

在 `app/theme/index.tsx` 文件顶部导入样式：

```typescript
// app/theme/index.tsx
import "@km-design/theme-system/index.css"; // ⚠️ 必须导入！
import { NextThemeProvider } from "@km-design/theme-system";
```

**为什么必须导入？**

主题系统通过 CSS 变量（`var(--primary)`、`var(--background)` 等）工作，这些变量定义在 `index.css` 中。如果不导入，所有主题变量都不会生效。

### 步骤 3: 创建主题包装器

在 `app/theme/` 目录下创建 `index.tsx` 文件：

```tsx
"use client";

import React from "react";
import { NextThemeProvider } from "@km-design/theme-system";
import "@km-design/theme-system/index.css";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      defaultTheme="km-base" // 默认主题名称
      enableStorage={true} // 启用主题持久化（保存到 localStorage）
      storageKey="km-flow-theme" // localStorage 存储键名（可按项目自定义）
    >
      {children}
    </NextThemeProvider>
  );
}
```

**参数说明：**

| 参数            | 类型      | 默认值       | 说明                                                                                                                          |
| --------------- | --------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `defaultTheme`  | `string`  | `"default"`  | 默认主题名称，可选：`default`、`dark`、`km-base`、`km-flow-light-theme`、`forest`、`party`、`spring-festival`、`red-theme` 等 |
| `enableStorage` | `boolean` | `true`       | 是否将主题选择保存到 localStorage                                                                                             |
| `storageKey`    | `string`  | `"km-theme"` | localStorage 存储键名，不同项目可使用不同键名避免冲突                                                                         |

**默认主题选项：**

- `"default"` - 默认主题（浅色）
- `"dark"` - 暗色主题
- `"km-base"` - KM 基准主题（推荐）
- `"km-flow-light-theme"` - KM Flow 浅色主题
- `"forest"` - 深林主题（暗色）
- `"party"` - 派对主题（暗色）
- `"spring-festival"` - 春节主题（浅色）
- `"red-theme"` - 红色主题（浅色）

### 步骤 4: 注入主题 Provider

在根布局文件 `app/layout.tsx` 中导入并使用 `ThemeWrapper`：

```tsx
import { ThemeWrapper } from "./theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
```

**注意事项：**

- `ThemeWrapper` 必须包裹所有需要主题的组件
- 确保 `ThemeWrapper` 在 `<body>` 标签内，而不是 `<html>` 外
- 如果项目有多个布局文件，确保在根布局中注入

### 步骤 5: 创建主题控制组件

创建 `app/components/header/theme-control.tsx` 文件，提供主题切换下拉菜单和自定义主题编辑器入口：

```tsx
"use client";

import React from "react";
import { Dropdown, Button, Space } from "antd";
import {
  CheckOutlined,
  BgColorsOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  useTheme,
  ThemeEditor,
  getThemeMetadata,
  getAvailableThemes,
} from "@km-design/theme-system";

const ThemeControl = () => {
  const { currentTheme, switchTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const themes = React.useMemo(() => getAvailableThemes(), []);

  const menuItems = [
    ...themes.map((key) => {
      const meta = getThemeMetadata(key);
      const isActive = currentTheme === key;
      return {
        key,
        label: (
          <Space>
            <span>{meta?.name || key}</span>
            {isActive && <CheckOutlined style={{ color: "#52c41a" }} />}
          </Space>
        ),
        onClick: () => switchTheme(key),
      };
    }),
    { type: "divider" as const },
    {
      key: "open-editor",
      label: (
        <Space>
          <SettingOutlined />
          <span>自定义主题配置</span>
        </Space>
      ),
      onClick: () => setOpen(true),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Button
          className="theme-switcher-button"
          icon={<BgColorsOutlined />}
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            borderColor: "var(--primary)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            fontWeight: 500,
          }}
        >
          {getThemeMetadata(currentTheme)?.name || currentTheme}
        </Button>
      </Dropdown>
      <ThemeEditor open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default ThemeControl;
```

**组件说明：**

- **主题切换下拉**：显示所有可用主题，当前主题带勾选标记
- **自定义主题配置**：点击后打开 `ThemeEditor` 侧边栏，可实时调整颜色、字体、间距、圆角、边框等
- **样式**：按钮使用主题变量 `var(--primary)` 和 `var(--primary-foreground)`，确保随主题变化

### 步骤 6: 集成到导航栏

在头部组件 `app/components/header/index.tsx` 中导入并使用 `ThemeControl`：

```tsx
"use client";
import ThemeControl from "./theme-control";

export default function Header() {
  return (
    <div className="flex flex-1 items-center justify-between px-4 bg-card text-card-foreground border-b border-border">
      {/* 左侧内容 */}
      <div className="flex items-center">{/* Logo、导航等 */}</div>

      {/* 右侧内容 */}
      <div className="flex items-center flex-shrink-0">
        {/* 其他按钮 */}
        <ThemeControl /> {/* 主题控制组件 */}
        {/* 用户头像等 */}
      </div>
    </div>
  );
}
```

**样式建议：**

头部容器建议使用主题变量类名：

- `bg-card` - 卡片背景色
- `text-card-foreground` - 卡片文字颜色
- `border-b border-border` - 底部边框

### 步骤 7: 配置 Tailwind CSS ⚠️ 重要！

如果项目使用 Tailwind CSS，需要在 `tailwind.config.js` 或 `tailwind.config.ts` 中配置主题变量。

**⚠️ 重要：** 只有配置了这些变量，Tailwind 类名（如 `bg-primary`、`text-foreground`、`p-md` 等）才能正确使用主题系统的颜色和间距。

#### 方式一：JavaScript 配置（tailwind.config.js）

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 指定要扫描的文件路径
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  // 启用 class 模式的暗色主题（主题系统会自动切换）
  darkMode: "class",
  theme: {
    extend: {
      // ========== 颜色配置 ==========
      colors: {
        // 语义化颜色（基础颜色，用于背景、文字等）
        background: "var(--background)", // 页面背景色
        foreground: "var(--foreground)", // 主要文字颜色
        card: {
          DEFAULT: "var(--card)", // 卡片背景色
          foreground: "var(--card-foreground)", // 卡片文字颜色
        },
        popover: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)", // 边框颜色
        input: "var(--input)", // 输入框边框颜色
        ring: "var(--primary)", // 焦点环颜色（通常使用主色）

        // 静音/次要颜色
        muted: {
          DEFAULT: "var(--muted)", // 静音背景色
          foreground: "var(--muted-foreground)", // 静音文字颜色
        },

        // 强调色
        accent: {
          DEFAULT: "var(--accent)", // 强调背景色
          foreground: "var(--accent-foreground)", // 强调文字颜色
        },

        // 危险/错误色
        destructive: {
          DEFAULT: "var(--destructive)", // 危险操作背景色
          foreground: "var(--destructive-foreground)", // 危险操作文字颜色
        },

        // 品牌色梯度（主色）
        primary: {
          DEFAULT: "var(--primary)", // 主色（默认使用 500）
          foreground: "var(--primary-foreground, #ffffff)", // 主色文字颜色
          50: "var(--color-primary-50)", // 最浅
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)", // 主色（常用）
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)", // 最深
        },

        // 辅助色梯度
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
        },

        // 成功色梯度
        success: {
          DEFAULT: "var(--success, #16a34a)",
          50: "var(--color-success-50)",
          100: "var(--color-success-100)",
          200: "var(--color-success-200)",
          300: "var(--color-success-300)",
          400: "var(--color-success-400)",
          500: "var(--color-success-500)",
          600: "var(--color-success-600)",
          700: "var(--color-success-700)",
          800: "var(--color-success-800)",
          900: "var(--color-success-900)",
        },

        // 警告色梯度
        warning: {
          DEFAULT: "var(--warning, #f59e0b)",
          50: "var(--color-warning-50)",
          100: "var(--color-warning-100)",
          200: "var(--color-warning-200)",
          300: "var(--color-warning-300)",
          400: "var(--color-warning-400)",
          500: "var(--color-warning-500)",
          600: "var(--color-warning-600)",
          700: "var(--color-warning-700)",
          800: "var(--color-warning-800)",
          900: "var(--color-warning-900)",
        },

        // 错误色梯度
        error: {
          DEFAULT: "var(--error, #ef4444)",
          50: "var(--color-error-50)",
          100: "var(--color-error-100)",
          200: "var(--color-error-200)",
          300: "var(--color-error-300)",
          400: "var(--color-error-400)",
          500: "var(--color-error-500)",
          600: "var(--color-error-600)",
          700: "var(--color-error-700)",
          800: "var(--color-error-800)",
          900: "var(--color-error-900)",
        },

        // 信息色梯度
        info: {
          DEFAULT: "var(--info)",
          50: "var(--color-info-50)",
          100: "var(--color-info-100)",
          200: "var(--color-info-200)",
          300: "var(--color-info-300)",
          400: "var(--color-info-400)",
          500: "var(--color-info-500)",
          600: "var(--color-info-600)",
          700: "var(--color-info-700)",
          800: "var(--color-info-800)",
          900: "var(--color-info-900)",
        },

        // 中性色梯度（灰色系）
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },

        // 保留项目原有颜色配置（如 gray、blue 等）
        // ... 你的其他颜色配置
      },

      // ========== 间距配置 ==========
      spacing: {
        xs: "var(--spacing-xs, 0.25rem)", // 超小间距（通常 4px）
        sm: "var(--spacing-sm, 0.5rem)", // 小间距（通常 8px）
        md: "var(--spacing-md, 1rem)", // 中等间距（通常 16px）
        lg: "var(--spacing-lg, 1.5rem)", // 大间距（通常 24px）
        xl: "var(--spacing-xl, 2rem)", // 超大间距（通常 32px）
        "2xl": "var(--spacing-2xl, 3rem)", // 2倍大间距（通常 48px）
        "3xl": "var(--spacing-3xl, 4rem)", // 3倍大间距（通常 64px）
      },

      // ========== 圆角配置 ==========
      borderRadius: {
        none: "var(--radius-none, 0)", // 无圆角
        sm: "var(--radius-sm, 0.125rem)", // 小圆角（通常 2px）
        md: "var(--radius-md, 0.375rem)", // 中等圆角（通常 6px）
        lg: "var(--radius-lg, 0.5rem)", // 大圆角（通常 8px）
        xl: "var(--radius-xl, 0.75rem)", // 超大圆角（通常 12px）
        "2xl": "var(--radius-2xl, 1rem)", // 2倍大圆角（通常 16px）
        full: "var(--radius-full, 9999px)", // 完全圆形
      },

      // ========== 字体配置 ==========
      fontFamily: {
        sans: "var(--font-family-sans)", // 无衬线字体（默认字体）
        mono: "var(--font-family-mono)", // 等宽字体（代码字体）
      },
      fontSize: {
        xs: "var(--font-size-xs)", // 超小字体
        sm: "var(--font-size-sm)", // 小字体
        base: "var(--font-size-base)", // 基础字体（默认）
        lg: "var(--font-size-lg)", // 大字体
        xl: "var(--font-size-xl)", // 超大字体
        "2xl": "var(--font-size-2xl)", // 2倍大字体
        "3xl": "var(--font-size-3xl)", // 3倍大字体
        "4xl": "var(--font-size-4xl)", // 4倍大字体
      },
      fontWeight: {
        light: "var(--font-weight-light)", // 细体（300）
        normal: "var(--font-weight-normal)", // 常规（400）
        medium: "var(--font-weight-medium)", // 中等（500）
        semibold: "var(--font-weight-semibold)", // 半粗（600）
        bold: "var(--font-weight-bold)", // 粗体（700）
      },
      lineHeight: {
        tight: "var(--line-height-tight)", // 紧凑行高
        normal: "var(--line-height-normal)", // 正常行高
        relaxed: "var(--line-height-relaxed)", // 宽松行高
      },

      // ========== 阴影配置 ==========
      boxShadow: {
        none: "var(--shadow-none)", // 无阴影
        sm: "var(--shadow-sm)", // 小阴影
        md: "var(--shadow-md)", // 中等阴影
        lg: "var(--shadow-lg)", // 大阴影
        xl: "var(--shadow-xl)", // 超大阴影
        "2xl": "var(--shadow-2xl)", // 2倍大阴影
        inner: "var(--shadow-inner)", // 内阴影
      },

      // ========== 边框配置 ==========
      borderWidth: {
        none: "var(--border-width-none)", // 无边框
        thin: "var(--border-width-thin)", // 细边框（通常 1px）
        medium: "var(--border-width-medium)", // 中等边框（通常 2px）
        thick: "var(--border-width-thick)", // 粗边框（通常 3px）
      },

      // ========== 动画配置 ==========
      transitionDuration: {
        fast: "var(--animation-duration-fast)", // 快速动画
        normal: "var(--animation-duration-normal)", // 正常动画
        slow: "var(--animation-duration-slow)", // 慢速动画
      },
      transitionTimingFunction: {
        default: "var(--animation-easing-default)", // 默认缓动
        in: "var(--animation-easing-in)", // 缓入
        out: "var(--animation-easing-out)", // 缓出
        "in-out": "var(--animation-easing-inOut)", // 缓入缓出
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  corePlugins: {
    preflight: false, // 如果项目已有全局样式，可禁用 preflight
  },
};
```

#### 方式二：TypeScript 配置（tailwind.config.ts）

如果项目使用 TypeScript，可以使用以下配置：

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ... 与上面 JavaScript 配置相同的内容
    },
  },
  plugins: [require("@tailwindcss/typography")],
  corePlugins: {
    preflight: false,
  },
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

- 配置后需要**重启开发服务器**才能生效
- 如果某些类名不生效，检查 `content` 配置是否包含对应的文件路径
- 确保已导入主题系统的样式文件（`@km-design/theme-system/index.css`）
- 如果项目已有颜色配置（如 `gray`、`blue` 等），保留它们，主题变量会通过 `extend` 扩展

### 步骤 8: 全局样式绑定

在全局样式文件 `app/styles/globals.css` 中绑定主题变量：

```css
/* 引入主题样式 */
@import "@km-design/theme-system/index.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/* 全局主题绑定 */
body {
  font-family: var(--font-family-sans);
  background-color: var(--background);
  color: var(--foreground);
  overflow-x: hidden;
}

/* 主题适配覆盖 - 将常见硬编码样式映射到主题变量 */
.bg-white {
  background-color: var(--card) !important;
}

.bg-gray-50,
.bg-gray-100 {
  background-color: var(--muted) !important;
}

.text-black,
.text-gray-900,
.text-gray-800 {
  color: var(--foreground) !important;
}

.text-gray-700,
.text-gray-600,
.text-gray-500 {
  color: var(--muted-foreground) !important;
}

.border-gray-100,
.border-gray-200,
.border-gray-300 {
  border-color: var(--border) !important;
}

/* 链接颜色 */
a {
  color: var(--link, #1890ff);
}

a:hover {
  color: var(--link-hover, #40a9ff);
}

/* 标题字体大小 */
.h1 {
  font-size: var(--font-size-xl);
  color: var(--foreground);
}

.h2 {
  font-size: var(--font-size-lg);
  color: var(--foreground);
}
```

**覆盖策略说明：**

- **渐进式迁移**：新组件优先使用语义化类名（`bg-card`、`text-foreground` 等）
- **全局覆盖**：对常见硬编码样式（`bg-white`、`text-gray-*` 等）做全局映射，确保旧代码也能响应主题
- **保留原值**：主题中没有的属性保留原 CSS，最大限度保留 UI 原稿

### 步骤 9: 在组件中使用

#### 9.1 使用主题 Hook

```typescript
// app/components/Header.tsx
"use client";
import { useTheme } from "@km-design/theme-system";

export default function Header() {
  const {
    currentTheme, // 当前主题名称
    switchTheme, // 切换主题函数
    availableThemes, // 可用主题列表
    themeConfig, // 完整主题配置对象
    isDarkMode, // 是否为暗色模式
  } = useTheme();

  return (
    <header
      style={{
        background: "var(--card)",
        padding: "var(--spacing-md)",
        color: "var(--foreground)",
      }}
    >
      <div>我的应用</div>
      <p>当前主题: {currentTheme}</p>
      {isDarkMode && <span>🌙 暗色模式</span>}
    </header>
  );
}
```

#### 9.2 使用 CSS Variables（推荐）

在组件样式中直接使用 CSS 变量：

```typescript
// app/components/Card.tsx
export default function Card({ children }) {
  return (
    <div
      className="card"
      style={{
        background: "var(--card)",
        color: "var(--card-foreground)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-md)",
        boxShadow: "var(--shadow-md)",
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

#### 9.3 使用 Tailwind 类名

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

| 原写法                                  | 迁移写法                          | 说明     |
| --------------------------------------- | --------------------------------- | -------- |
| `background: #ffffff`                   | `background: var(--background)`   | 背景色   |
| `color: #000000`                        | `color: var(--foreground)`        | 文字颜色 |
| `border: 1px solid #e0e0e0`             | `border: 1px solid var(--border)` | 边框     |
| `padding: 16px`                         | `padding: var(--spacing-md)`      | 间距     |
| `border-radius: 8px`                    | `border-radius: var(--radius-md)` | 圆角     |
| `box-shadow: 0 2px 8px rgba(0,0,0,0.1)` | `box-shadow: var(--shadow-md)`    | 阴影     |

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

### 迁移示例

#### 背景色

```tsx
// ❌ 之前
<div className="bg-white">
<div className="bg-gray-50">

// ✅ 之后
<div className="bg-card">
<div className="bg-muted">
<div className="bg-background">
```

#### 文字颜色

```tsx
// ❌ 之前
<div className="text-black">
<div className="text-gray-800">
<div className="text-gray-500">

// ✅ 之后
<div className="text-foreground">
<div className="text-card-foreground">
<div className="text-muted-foreground">
```

#### 边框

```tsx
// ❌ 之前
<div className="border border-gray-200">

// ✅ 之后
<div className="border border-border">
```

#### 间距和圆角

```tsx
// ❌ 之前
<div className="p-4 rounded-lg">

// ✅ 之后
<div className="p-md rounded-md">
```

#### 卡片组件完整示例

```tsx
// ❌ 之前
<div className="bg-white text-gray-900 border border-gray-200 rounded-lg p-4 shadow-sm">
  卡片内容
</div>

// ✅ 之后
<div className="bg-card text-card-foreground border border-border rounded-md p-md shadow-sm">
  卡片内容
</div>
```

#### 按钮组件完整示例

```tsx
// ❌ 之前
<button className="bg-blue-500 text-white px-4 py-2 rounded-md">
  按钮
</button>

// ✅ 之后
<button className="bg-primary text-primary-foreground px-md py-sm rounded-md">
  按钮
</button>
```

---

## 🤖 AI 辅助适配

### 为什么需要 AI 辅助适配？

在大型项目中，手动逐个修改硬编码样式效率低下且容易出错。AI 辅助适配可以：

- ✅ **系统化识别**：自动识别组件层级和语义角色
- ✅ **标准化适配**：按照统一规则进行主题变量替换
- ✅ **边界明确**：只适配主题相关属性，保留 UI 设计原有架构
- ✅ **安全检查**：避免颜色对比度不足等问题
- ✅ **批量处理**：同类组件统一适配，确保一致性

### 🔒 适配边界原则（核心）

**主题适配的本质是"换肤"而不是"重新设计"**

| 属性类型     | 主题系统管控                                      | AI 适配行为      | 保持原样               |
| ------------ | ------------------------------------------------- | ---------------- | ---------------------- |
| **颜色**     | ✅ `--background`、`--foreground`、`--primary` 等 | 替换为主题变量   | 特殊业务颜色、渐变效果 |
| **字体**     | ✅ `--font-family-sans`、`--font-size-base` 等    | 替换为主题变量   | 特殊字体、图标字体     |
| **间距**     | ✅ `--spacing-xs`、`--spacing-md` 等              | 替换为主题变量   | 业务特定间距           |
| **圆角**     | ✅ `--radius-sm`、`--radius-md` 等                | 替换为主题变量   | 特殊形状设计           |
| **布局**     | ❌ flex、grid、position 等                        | **完全保持不变** | 所有布局属性           |
| **动画**     | ❌ transition、animation 等                       | **完全保持不变** | 所有动画效果           |
| **业务样式** | ❌ 特定宽高、特殊效果等                           | **完全保持不变** | 业务逻辑相关样式       |

### 配合使用指南

本集成指南与《AI 主题适配指南》配合使用：

| 文档            | 作用     | 使用场景                           |
| --------------- | -------- | ---------------------------------- |
| **本文档**      | 系统集成 | 安装主题包、配置环境、创建基础组件 |
| **AI 适配指南** | 样式适配 | AI 辅助进行大规模样式迁移和优化    |

### 推荐流程

1. **基础集成**（按本文档）：

   ```bash
   # 1. 安装主题包和配置环境
   pnpm add -E "@km-design/theme-system@git+https://github.com/hjw472015868/theme.git#latest"
   ```

2. **AI 辅助适配**（按 AI 适配指南）：

   - 读取《AI 主题适配指南》了解边界原则和层级系统
   - 使用 AI 进行组件分析和批量样式替换
   - 执行边界检查和一致性验证

3. **验证测试**：
   - 检查所有主题下的显示效果
   - 确认原有布局和动画未被影响
   - 验证构建无错误

### 适配示例对比

```tsx
// ✅ 正确适配 - 边界明确
<div className="
  bg-card text-foreground p-md rounded-md     /* 主题属性 - 适配 */
  flex items-center justify-between           /* 布局属性 - 保持不变 */
  min-h-[64px] w-full                        /* 业务尺寸 - 保持不变 */
  transform transition-all duration-200       /* 动画效果 - 保持不变 */
  hover:scale-105                            /* 特殊效果 - 保持不变 */
">
  内容
</div>

// ❌ 错误适配 - 过度修改
<div className="
  bg-card text-foreground p-md rounded-md     /* 主题属性 ✅ */
  flex items-start justify-start              /* 布局被错误修改 ❌ */
  h-16 w-auto                                /* 尺寸被错误修改 ❌ */
">
  内容
</div>
```

### 获取 AI 适配指南

详细的 AI 适配规则和标准流程请参考：

- 📖 [AI 主题适配指南](./AI主题适配指南.md)

---

## ❓ 常见问题

### Q1: 导入样式后报错 "Module not found: Package path ./index.css is not exported"

**原因：** 包的 `exports` 字段未正确配置样式文件导出。

**解决方案：**

1. 确保使用最新版本的主题包（`#v1.0.6` 或 `#latest` 标签）
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
- [ ] 已配置 `NextThemeProvider`
- [ ] 样式使用 CSS 变量而非硬编码
- [ ] Tailwind 配置正确（如果使用）
- [ ] 已重启开发服务器

### Q3: 首页内容消失？

**A**: 可能原因：

1. 布局文件中添加了额外的包裹层导致内容被隐藏
2. 检查 `(commonLayout)/layout.tsx` 是否有影响渲染的样式
3. 确保 `children` 正常渲染，不要添加不必要的容器

**解决方案：**

确保布局文件简洁，不要添加额外的包裹层：

```tsx
// ✅ 正确
export default function Layout({ children }) {
  return <>{children}</>;
}

// ❌ 错误 - 不要添加额外的容器
export default function Layout({ children }) {
  return <div className="bg-background min-h-screen">{children}</div>;
}
```

### Q4: 如何调整默认主题？

**A**: 修改 `app/theme/index.tsx` 中的 `defaultTheme` 属性：

```tsx
<NextThemeProvider
  defaultTheme="dark"  // 改为你想要的默认主题
  // ...
>
```

### Q5: 如何自定义主题变量？

**A**: 两种方式：

1. **可视化编辑**：点击导航栏的主题按钮 → 选择"自定义主题配置" → 在侧边栏中实时调整
2. **代码编辑**：在 `ThemeEditor` 的"JSON 编辑"标签页中直接编辑 JSON 配置

### Q6: 主题配置如何持久化？

**A**:

- 主题选择会自动保存到 `localStorage`（如果 `enableStorage={true}`）
- 自定义主题配置会保存为覆盖配置，键名为 `km-theme-override-{themeName}`
- 建议导出 JSON 文件永久保存，或集成到代码中作为预设主题

### Q7: Tailwind 类名不生效？

**A**:

1. 确认 `tailwind.config.js` 中已正确配置 `content` 路径
2. **重启开发服务器**让 Tailwind 重新读取配置
3. 检查类名拼写是否正确（如 `bg-card` 而不是 `bg-card-bg`）
4. 确认已导入主题样式文件

### Q8: 如何添加新的预设主题？

**A**:

1. 在主题库的 `presets/` 目录下创建 JSON 文件
2. 在 `nextjs-adapter.tsx` 中静态导入并注册
3. 重新构建主题包并更新版本
4. 在项目中更新主题包版本

### Q9: 主题编辑器中的修改如何应用到所有页面？

**A**:

- 主题编辑器修改的是 CSS Variables，会立即应用到所有使用这些变量的元素
- 确保组件使用了主题变量类名或 CSS 变量，而不是硬编码的颜色值
- 修改后点击"完成"保存，配置会持久化到 localStorage

### Q10: 如何获取主题的特定颜色值？

```typescript
import { useTheme } from "@km-design/theme-system";

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

### Q11: 如何禁用主题持久化？

```typescript
<NextThemeProvider
  defaultTheme="km-base"
  enableStorage={false} // 禁用持久化
>
  {children}
</NextThemeProvider>
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

1. 在导航栏点击主题切换按钮
2. 选择不同的主题
3. 检查页面样式是否实时更新
4. 刷新页面，检查主题是否保持（如果启用了 `enableStorage`）

### 3. 测试主题配置中心

1. 打开主题配置中心（点击"自定义主题配置"）
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

- [@km-design/theme-system 官方文档](https://github.com/hjw472015868/theme)
- [主题系统使用指南](./node_modules/@km-design/theme-system/docs/使用指南.md)
- [样式迁移指南](./node_modules/@km-design/theme-system/docs/样式迁移指南.md)
- [UmiJS 集成指南](./UmiJS集成指南.md)

---

## 🎯 集成检查清单

在完成集成后，请确认以下项目：

- [ ] 已安装主题包（`pnpm add -E "@km-design/theme-system@git+https://github.com/hjw472015868/theme.git#v1.0.6"`）
- [ ] 已导入样式文件（`import '@km-design/theme-system/index.css'`）
- [ ] 已创建 `ThemeWrapper` 组件
- [ ] 已配置 `NextThemeProvider` 包裹应用
- [ ] 已创建 `ThemeControl` 组件
- [ ] 已集成 `ThemeControl` 到导航栏
- [ ] 已配置 Tailwind CSS（如果使用）
- [ ] 已绑定全局样式主题变量
- [ ] 已迁移硬编码样式为 CSS 变量
- [ ] 主题切换功能正常
- [ ] 主题持久化正常（刷新后保持）
- [ ] 主题配置中心可以正常使用
- [ ] 控制台无错误信息

---

## 🎯 最佳实践

1. **新组件优先使用语义化类名**：`bg-card`、`text-foreground`、`p-md`、`rounded-md` 等
2. **逐步迁移旧组件**：不要一次性修改所有文件，按优先级逐步迁移
3. **保留原值兜底**：主题中没有的属性保留原 CSS，确保 UI 完整
4. **使用主题变量**：避免硬编码颜色、间距、圆角等值
5. **测试主题切换**：确保所有主题下界面都正常显示
6. **重启开发服务器**：修改 Tailwind 配置后必须重启才能生效

---

**最后更新**: 2025-01-XX  
**版本**: v1.0.6  
**维护者**: KM Design Team
