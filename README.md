# @km-design/theme-system

统一主题系统，支持 UmiJS 和 Next.js 项目。

## 📦 安装

### 从 GitHub 安装

```bash
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

## 快速开始

### UmiJS 项目

#### 1. 安装包

```bash
pnpm add git+https://github.com/hjw472015868/theme.git
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
  const { currentTheme, switchTheme } = useTheme();
  
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
pnpm add git+https://github.com/hjw472015868/theme.git
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
  const { currentTheme, isDarkMode } = useTheme();
  
  return (
    <div>
      <ThemeSwitcher />
      <p>当前主题: {currentTheme}</p>
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

## 预设主题

包内置以下预设主题：

- `default` - 默认主题
- `dark` - 暗色主题
- `km-base` - KM 基础主题
- `spring-festival` - 春节主题
- `forest` - 森林主题
- `party` - 派对主题
- `red-theme` - 红色主题

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

## 更新包

### 在其他项目中更新

```bash
# 更新到最新版本
pnpm update @km-design/theme-system

# 或指定版本
pnpm add @km-design/theme-system@git+https://github.com/hjw472015868/theme.git#v1.0.1
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

## 发布新版本

```bash
# 1. 更新版本号（package.json）
# 2. 构建包
pnpm build

# 3. 提交并推送
git add .
git commit -m "Release: v1.0.1"
git push

# 4. 创建标签
git tag v1.0.1
git push origin v1.0.1
```

## 许可证

MIT
