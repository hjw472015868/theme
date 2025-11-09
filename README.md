# @km-design/theme-system

统一主题系统，支持 UmiJS 和 Next.js 项目。

## 📦 安装

### 从 GitHub 安装

```bash
pnpm add git+https://github.com/hjw472015868/theme.git#v1.0.0
# 或指定版本
pnpm add git+https://github.com/hjw472015868/theme.git#v1.0.0
```

### 使用最新版本

```bash
pnpm add git+https://github.com/hjw472015868/theme.git
```

## 特性

- ✅ **统一管理**：所有主题配置集中在一个包中
- ✅ **多框架支持**：同时支持 UmiJS + Ant Design 和 Next.js 项目
- ✅ **自动同步**：修改主题包后，所有项目通过更新依赖即可同步
- ✅ **类型安全**：完整的 TypeScript 类型定义
- ✅ **框架适配**：提供 UmiJS 和 Next.js 专用适配器

## 安装

### 方式一：使用 workspace（monorepo 推荐）

如果你的项目在同一个 monorepo 中：

```json
// package.json
{
  "dependencies": {
    "@km-design/theme-system": "workspace:*"
  }
}
```

然后安装：

```bash
pnpm install
```

### 方式二：发布到 npm（如果发布）

```bash
pnpm add @km-design/theme-system
# 或
npm install @km-design/theme-system
```

### 方式三：本地链接（开发测试）

```bash
# 在主题包目录中
cd packages/theme-system
pnpm link

# 在你的项目中
cd /path/to/your/project
pnpm link @km-design/theme-system
```

## 快速开始

### UmiJS 项目

#### 1. 安装包

```bash
pnpm add @km-design/theme-system
```

#### 2. 在 app.tsx 中使用

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

#### 3. 在组件中使用

```typescript
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';

function MyComponent() {
  const { currentTheme, switchTheme, availableThemes } = useTheme();
  
  return (
    <div>
      <ThemeSwitcher />
      <p>当前主题: {currentTheme}</p>
    </div>
  );
}
```

### Next.js 项目

#### 1. 安装包

```bash
pnpm add @km-design/theme-system
```

#### 2. 在 layout.tsx 中使用

```typescript
// app/layout.tsx
'use client';
import { NextThemeProvider } from '@km-design/theme-system';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextThemeProvider defaultTheme="light">
          {children}
        </NextThemeProvider>
      </body>
    </html>
  );
}
```

#### 3. 在组件中使用

```typescript
'use client';
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';

export default function MyComponent() {
  const { currentTheme, switchTheme, isDarkMode } = useTheme();
  
  return (
    <div>
      <ThemeSwitcher />
      <p>当前主题: {currentTheme}</p>
      <p>暗色模式: {isDarkMode ? '是' : '否'}</p>
    </div>
  );
}
```

## API

### ThemeProvider

核心主题提供者组件。

#### Props

- `defaultTheme?: string` - 默认主题名称
- `enableStorage?: boolean` - 是否启用 localStorage 持久化（默认: true）
- `storageKey?: string` - localStorage 存储键名（默认: 'km-theme'）

### useTheme

获取主题上下文。

```typescript
const {
  currentTheme,        // 当前主题名称
  themeConfig,         // 当前主题配置
  transformedTheme,    // 转换后的主题（包含 antd、cssVars、tailwind）
  switchTheme,         // 切换主题函数
  availableThemes,     // 可用主题列表
  isDarkMode,          // 是否为暗色模式（仅 Next.js）
} = useTheme();
```

### ThemeSwitcher

主题切换器组件。

```typescript
<ThemeSwitcher 
  mode="dropdown"      // 'select' | 'dropdown' | 'button-group'
  size="middle"        // 'small' | 'middle' | 'large'
  showIcon={true}      // 是否显示图标
/>
```

### 注册主题

```typescript
import { registerTheme, registerThemes } from '@km-design/theme-system';
import customTheme from './custom-theme.json';

// 注册单个主题
registerTheme('custom', customTheme);

// 批量注册主题
registerThemes({
  custom1: customTheme1,
  custom2: customTheme2,
});
```

## 预设主题

包内置以下预设主题：

- `default` - 默认主题
- `dark` - 暗色主题
- `light` - 浅色主题
- `spring-festival` - 春节主题

## 使用 CSS Variables

主题系统会自动生成 CSS Variables，你可以在样式中使用：

### 在样式文件中

```css
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}
```

### 在组件中

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

## 使用 Tailwind CSS

在 `tailwind.config.js` 中配置：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // ... 更多颜色
      },
    },
  },
};
```

## 开发

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

## 📚 更多文档

- [使用指南](./USAGE_GUIDE.md) - 详细的使用说明和示例
- [开发指南](./DEVELOPMENT_GUIDE.md) - 如何开发和更新主题组件
- [安全迁移指南](./SAFE_MIGRATION_GUIDE.md) - 渐进式迁移步骤
- [快速参考](./QUICK_REFERENCE.md) - 日常开发命令

## 许可证

MIT

