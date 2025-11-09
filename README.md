# @km-design/theme-system

> 统一主题系统，支持 UmiJS 和 Next.js 项目。基于 Design Tokens 的现代化主题解决方案。

## 📖 目录

- [核心思想](#核心思想)
- [工作原理](#工作原理)
- [技术栈](#技术栈)
- [支持的平台](#支持的平台)
- [快速开始](#快速开始)
- [GitHub 集成方式](#github-集成方式)
- [API 文档](#api-文档)
- [预设主题](#预设主题)
- [使用指南](#使用指南)
- [开发指南](#开发指南)

---

## 🎯 核心思想

### 设计理念

`@km-design/theme-system` 基于以下核心思想构建：

1. **统一管理**：所有主题配置集中在一个包中，实现"一处修改，处处生效"
2. **Design Tokens 驱动**：基于 Design Tokens 标准，将设计语言转化为可复用的配置
3. **多格式输出**：自动转换为 Ant Design、CSS Variables、Tailwind CSS 等多种格式
4. **框架无关**：核心逻辑框架无关，通过适配器适配不同框架
5. **类型安全**：完整的 TypeScript 类型定义，提供良好的开发体验
6. **SSR 友好**：支持服务端渲染，确保主题在 SSR 环境下的正确应用

### 解决的问题

- ❌ **问题 1**：多个项目需要维护多份主题代码，修改主题需要同步多个项目
- ✅ **解决**：统一主题包，所有项目共享同一份主题配置

- ❌ **问题 2**：不同框架（UmiJS、Next.js）需要不同的主题实现方式
- ✅ **解决**：提供框架适配器，统一 API，不同框架使用相同的接口

- ❌ **问题 3**：主题切换需要同时更新 Ant Design、CSS Variables、Tailwind 配置
- ✅ **解决**：自动转换，一次配置，多格式输出

- ❌ **问题 4**：主题配置缺乏类型约束，容易出错
- ✅ **解决**：完整的 TypeScript 类型定义，编译时检查

---

## ⚙️ 工作原理

### 架构图

```
┌─────────────────────────────────────────────────────────┐
│                    Design Tokens (JSON)                   │
│  { colors, spacing, typography, borderRadius, ... }       │
└───────────────────────┬───────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              ThemeTransformer (转换器)                    │
│  ┌──────────────┬──────────────┬──────────────┐        │
│  │  Ant Design  │ CSS Variables│ Tailwind CSS │        │
│  │   Theme      │              │   Config      │        │
│  └──────────────┴──────────────┴──────────────┘        │
└───────────────────────┬───────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              ThemeProvider (核心提供者)                    │
│  • 主题注册与存储                                         │
│  • 主题切换逻辑                                           │
│  • CSS Variables 应用                                    │
│  • Ant Design ConfigProvider 配置                        │
└───────────────────────┬───────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐              ┌───────────────┐
│ UmiJS Adapter │              │ Next.js Adapter│
│ (require.context)            │ (静态导入)      │
└───────────────┘              └───────────────┘
```

### 工作流程

1. **主题注册阶段**
   - UmiJS：使用 `require.context` 自动加载 `presets/` 目录下的所有主题
   - Next.js：在适配器中静态导入所有预设主题

2. **主题转换阶段**
   - `ThemeTransformer` 将 Design Tokens 转换为：
     - **Ant Design Theme**：用于 `ConfigProvider` 配置
     - **CSS Variables**：动态注入到 `document.documentElement`
     - **Tailwind Theme**：用于 Tailwind CSS 配置（可选）

3. **主题应用阶段**
   - 应用 CSS Variables 到 DOM
   - 配置 Ant Design `ConfigProvider`
   - 持久化到 localStorage（可选）

4. **主题切换阶段**
   - 用户调用 `switchTheme(themeName)`
   - 系统查找已注册的主题
   - 重新转换并应用新主题
   - 更新 localStorage（如果启用）

### 数据流

```
用户操作: switchTheme('dark')
    │
    ▼
ThemeProvider.switchTheme()
    │
    ▼
查找 THEME_REGISTRY['dark']
    │
    ▼
ThemeTransformer.transformAll()
    │
    ├─► toAntdTheme() ──► ConfigProvider theme
    ├─► toCSSVariables() ──► applyCSSVariables() ──► DOM
    └─► toTailwindTheme() ──► (可选，用于配置)
    │
    ▼
更新 React State
    │
    ▼
触发组件重新渲染
```

---

## 🛠️ 技术栈

### 核心技术

- **React 18+**：使用 React Context API 管理主题状态
- **TypeScript**：完整的类型定义，提供类型安全
- **Design Tokens**：基于 JSON 格式的设计令牌标准
- **CSS Variables**：使用原生 CSS 变量实现动态主题
- **Ant Design 5**：集成 Ant Design 的主题系统

### 构建工具

- **Rollup**：模块打包工具，支持 ESM 和 CommonJS 双格式输出
- **TypeScript Compiler**：类型检查和声明文件生成
- **PostCSS**：处理 CSS/LESS 文件

### 框架适配

- **UmiJS**：使用 `require.context` 实现主题自动加载
- **Next.js**：使用静态导入和 `'use client'` 指令支持 SSR

---

## 🌐 支持的平台

### 框架支持

| 框架 | 版本要求 | 适配器 | 状态 |
|------|---------|--------|------|
| **UmiJS** | 4.x+ | `UmiThemeProvider` | ✅ 完全支持 |
| **Next.js** | 13.x+ (App Router) | `NextThemeProvider` | ✅ 完全支持 |
| **React** | 18.0.0+ | 核心 `ThemeProvider` | ✅ 完全支持 |

### UI 库支持

| UI 库 | 版本要求 | 支持方式 | 状态 |
|-------|---------|---------|------|
| **Ant Design** | 5.0.0+ | `ConfigProvider` 配置 | ✅ 完全支持 |
| **Tailwind CSS** | 3.0.0+ | CSS Variables 映射 | ✅ 完全支持 |
| **原生 CSS** | - | CSS Variables | ✅ 完全支持 |

### 浏览器支持

- Chrome/Edge (最新 2 个版本)
- Firefox (最新 2 个版本)
- Safari (最新 2 个版本)
- 支持 CSS Variables 的现代浏览器

---

## 🚀 快速开始

### 安装

#### 从 GitHub 安装（推荐）

```bash
# 安装指定版本
pnpm add git+https://github.com/hjw472015868/theme.git#v1.0.0

# 或安装最新版本
pnpm add git+https://github.com/hjw472015868/theme.git
```

#### 在 package.json 中配置

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/hjw472015868/theme.git#v1.0.0"
  }
}
```

### UmiJS 项目

#### 1. 在 `app.tsx` 中使用

```typescript
// app.tsx
import { UmiThemeProvider } from '@km-design/theme-system';

export function rootContainer(container: React.ReactElement) {
  return (
    <UmiThemeProvider defaultTheme="km-base">
      {container}
    </UmiThemeProvider>
  );
}
```

#### 2. 在组件中使用

```typescript
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';

function MyComponent() {
  const { currentTheme, switchTheme } = useTheme();
  
  return (
    <div>
      <ThemeSwitcher />
      <p>当前主题: {currentTheme}</p>
      <button onClick={() => switchTheme('dark')}>切换到暗色</button>
    </div>
  );
}
```

### Next.js 项目

#### 1. 在 `app/layout.tsx` 中使用

```typescript
// app/layout.tsx
'use client';
import { NextThemeProvider } from '@km-design/theme-system';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <NextThemeProvider defaultTheme="light">
          {children}
        </NextThemeProvider>
      </body>
    </html>
  );
}
```

#### 2. 在组件中使用

```typescript
// app/components/Header.tsx
'use client';
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';

export default function Header() {
  const { currentTheme, isDarkMode } = useTheme();
  
  return (
    <header>
      <ThemeSwitcher />
      <p>当前主题: {currentTheme}</p>
      {isDarkMode && <span>🌙</span>}
    </header>
  );
}
```

---

## 📦 GitHub 集成方式

### 为什么使用 GitHub？

- ✅ **版本控制**：完整的 Git 历史记录
- ✅ **标签管理**：使用 Git 标签管理版本
- ✅ **开源协作**：团队成员可以贡献和审查
- ✅ **无需 npm 账号**：不需要发布到 npm 即可使用
- ✅ **灵活更新**：可以快速发布新版本

### 安装步骤

#### 1. 在项目中安装

```bash
# 安装指定版本（推荐）
pnpm add git+https://github.com/hjw472015868/theme.git#v1.0.0

# 或安装最新版本
pnpm add git+https://github.com/hjw472015868/theme.git
```

#### 2. 配置 package.json

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/hjw472015868/theme.git#v1.0.0"
  }
}
```

#### 3. 安装依赖

```bash
pnpm install
```

### 更新包

#### 更新到最新版本

```bash
# 更新到最新提交
pnpm update @km-design/theme-system

# 或重新安装
pnpm add git+https://github.com/hjw472015868/theme.git
```

#### 更新到指定版本

```bash
# 更新到指定标签版本
pnpm add git+https://github.com/hjw472015868/theme.git#v1.0.1
```

### 版本管理

主题包使用 Git 标签进行版本管理：

```bash
# 查看可用版本
git ls-remote --tags https://github.com/hjw472015868/theme.git

# 安装特定版本
pnpm add git+https://github.com/hjw472015868/theme.git#v1.0.0
```

### 在 monorepo 中使用

如果项目是 monorepo，可以在根目录的 `package.json` 中配置：

```json
{
  "pnpm": {
    "overrides": {
      "@km-design/theme-system": "git+https://github.com/hjw472015868/theme.git#v1.0.0"
    }
  }
}
```

---

## 📚 API 文档

### ThemeProvider

核心主题提供者组件。

#### Props

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;        // 默认主题名称，默认: 'default'
  enableStorage?: boolean;       // 是否启用 localStorage 持久化，默认: true
  storageKey?: string;          // localStorage 存储键名，默认: 'km-theme'
}
```

#### 使用示例

```typescript
<UmiThemeProvider 
  defaultTheme="km-base"
  enableStorage={true}
  storageKey="my-app-theme"
>
  {children}
</UmiThemeProvider>
```

### useTheme

获取主题上下文的 Hook。

#### 返回值

```typescript
const {
  currentTheme,        // 当前主题名称: string
  themeConfig,         // 当前主题配置: ThemeConfig | null
  transformedTheme,    // 转换后的主题: TransformedTheme | null
  switchTheme,         // 切换主题函数: (themeName: string) => void
  availableThemes,     // 可用主题列表: string[]
  isDarkMode,          // 是否为暗色模式（仅 Next.js）: boolean
} = useTheme();
```

#### 使用示例

```typescript
function MyComponent() {
  const { currentTheme, switchTheme, availableThemes } = useTheme();
  
  return (
    <div>
      <p>当前主题: {currentTheme}</p>
      <p>可用主题: {availableThemes.join(', ')}</p>
      <button onClick={() => switchTheme('dark')}>切换到暗色</button>
    </div>
  );
}
```

### ThemeSwitcher

主题切换器组件。

#### Props

```typescript
interface ThemeSwitcherProps {
  mode?: 'select' | 'dropdown' | 'button-group';  // 显示模式，默认: 'dropdown'
  size?: 'small' | 'middle' | 'large';           // 大小，默认: 'middle'
  showIcon?: boolean;                              // 是否显示图标，默认: true
  className?: string;                              // 自定义类名
}
```

#### 使用示例

```typescript
<ThemeSwitcher 
  mode="dropdown"
  size="middle"
  showIcon={true}
/>
```

### 主题注册 API

#### registerTheme

注册单个主题。

```typescript
import { registerTheme } from '@km-design/theme-system';
import customTheme from './themes/custom.json';

registerTheme('custom', customTheme);
```

#### registerThemes

批量注册主题。

```typescript
import { registerThemes } from '@km-design/theme-system';
import theme1 from './themes/theme1.json';
import theme2 from './themes/theme2.json';

registerThemes({
  'theme1': theme1,
  'theme2': theme2,
});
```

#### getRegisteredThemes

获取所有已注册的主题。

```typescript
import { getRegisteredThemes } from '@km-design/theme-system';

const themes = getRegisteredThemes();
console.log('已注册的主题:', Object.keys(themes));
```

---

## 🎨 预设主题

包内置以下预设主题：

| 主题名称 | 描述 | 模式 |
|---------|------|------|
| `default` | 默认主题 | Light |
| `dark` | 暗色主题 | Dark |
| `km-base` | KM 基础主题 | Light |
| `spring-festival` | 春节主题 | Light |
| `forest` | 森林主题 | Light |
| `party` | 派对主题 | Light |
| `red-theme` | 红色主题 | Light |

### 使用预设主题

```typescript
// 切换主题
const { switchTheme } = useTheme();
switchTheme('dark');
switchTheme('spring-festival');
```

---

## 📖 使用指南

### 使用 CSS Variables

主题系统会自动生成 CSS Variables，你可以在样式中使用：

#### 在样式文件中

```css
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}
```

#### 在组件中

```typescript
// 内联样式
<div style={{
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  padding: 'var(--spacing-md)',
}}>
  内容
</div>
```

### 使用 Tailwind CSS

在 `tailwind.config.js` 中配置：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          // ... 更多颜色梯度
        },
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
    },
  },
};
```

然后可以在组件中使用：

```typescript
<div className="bg-background text-foreground p-md rounded-md">
  <button className="bg-primary text-primary-foreground px-lg py-sm">
    按钮
  </button>
</div>
```

### 注册自定义主题

#### 创建主题文件

```json
// themes/custom.json
{
  "meta": {
    "name": "自定义主题",
    "version": "1.0.0",
    "mode": "light"
  },
  "colors": {
    "primary": {
      "50": "#e3f2fd",
      "500": "#1890ff",
      "900": "#0a3d91"
    },
    // ... 更多配置
  }
}
```

#### 注册主题

```typescript
// UmiJS 项目
import { registerTheme } from '@km-design/theme-system';
import customTheme from './themes/custom.json';

registerTheme('custom', customTheme);

// Next.js 项目
'use client';
import { registerTheme } from '@km-design/theme-system';
import customTheme from './themes/custom.json';
import { useEffect } from 'react';

export default function ThemeSetup() {
  useEffect(() => {
    registerTheme('custom', customTheme);
  }, []);
  return null;
}
```

---

## 🔧 开发指南

### 本地开发

#### 在 monorepo 中使用 workspace

```json
// package.json
{
  "dependencies": {
    "@km-design/theme-system": "workspace:*"
  }
}
```

#### 开发流程

1. 修改主题包代码
2. 构建包：`pnpm build`
3. 在项目中测试

### 构建包

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 类型检查
pnpm type-check

# 开发模式（监听文件变化）
pnpm dev
```

### 发布新版本

1. 更新 `package.json` 中的版本号
2. 构建包：`pnpm build`
3. 提交并推送：
   ```bash
   git add .
   git commit -m "Release: v1.0.1"
   git push
   ```
4. 创建标签：
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

---

## 📝 更多文档

- [使用指南](./docs/使用指南.md) - 详细的使用说明和示例
- [开发指南](./docs/开发指南.md) - 开发和更新主题组件的指南
- [开发工作流程](./docs/开发工作流程.md) - 开发流程和使用方式说明
- [协作开发指南](./docs/协作开发指南.md) - 如何参与开发和贡献
- [打包说明](./docs/打包说明.md) - workspace 协议对打包的影响
- [快速参考](./docs/快速参考.md) - 快速参考手册

---

## 📄 许可证

MIT

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0
