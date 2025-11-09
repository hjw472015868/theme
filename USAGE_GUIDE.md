# 使用指南 - 在其他项目中使用主题包

## 📦 安装

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
# 安装包
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

---

## 🚀 UmiJS 项目使用

### 1. 安装包

```bash
pnpm add @km-design/theme-system
```

### 2. 在 app.tsx 中使用

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

### 3. 在组件中使用

```typescript
// 任何组件中
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';

function MyComponent() {
  const { currentTheme, switchTheme, availableThemes } = useTheme();
  
  return (
    <div>
      <ThemeSwitcher />
      <p>当前主题: {currentTheme}</p>
      <button onClick={() => switchTheme('dark')}>切换到暗色</button>
    </div>
  );
}
```

### 4. 配置 Tailwind CSS（可选）

在 `tailwind.config.js` 中配置：

```javascript
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        // ... 更多颜色
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
  plugins: [],
};
```

---

## 🚀 Next.js 项目使用

### 1. 安装包

```bash
pnpm add @km-design/theme-system
```

### 2. 在 layout.tsx 中使用

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

### 3. 在组件中使用

```typescript
// 任何客户端组件中
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

### 4. 配置 Tailwind CSS（可选）

在 `tailwind.config.js` 中配置（与 UmiJS 相同）：

```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // ... 更多颜色
      },
    },
  },
  plugins: [],
};
```

---

## 📝 完整示例

### UmiJS 项目完整示例

```typescript
// app.tsx
import { UmiThemeProvider } from '@km-design/theme-system';

export function rootContainer(container: React.ReactElement) {
  return (
    <UmiThemeProvider 
      defaultTheme="km-base"
      enableStorage={true}
      storageKey="my-app-theme"
    >
      {container}
    </UmiThemeProvider>
  );
}
```

```typescript
// src/components/Header.tsx
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';

export default function Header() {
  const { currentTheme } = useTheme();
  
  return (
    <header style={{ background: 'var(--card)', padding: 'var(--spacing-md)' }}>
      <div>我的应用</div>
      <ThemeSwitcher />
    </header>
  );
}
```

### Next.js 项目完整示例

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
        <NextThemeProvider 
          defaultTheme="light"
          enableStorage={true}
          storageKey="my-app-theme"
        >
          {children}
        </NextThemeProvider>
      </body>
    </html>
  );
}
```

```typescript
// app/components/Header.tsx
'use client';
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';

export default function Header() {
  const { currentTheme, isDarkMode } = useTheme();
  
  return (
    <header className="bg-card p-md">
      <div>我的应用</div>
      <ThemeSwitcher />
      {isDarkMode && <span>🌙</span>}
    </header>
  );
}
```

---

## 🎨 使用 CSS Variables

### 在样式文件中使用

```css
/* styles.css 或 styles.less */
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.my-card {
  background-color: var(--card);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-md);
}
```

### 在组件中使用

```typescript
// 内联样式
<div style={{
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  padding: 'var(--spacing-md)',
}}>
  内容
</div>

// 使用 Tailwind CSS
<div className="bg-background text-foreground p-md">
  内容
</div>
```

---

## 🎯 使用 Tailwind CSS 类名

安装并配置 Tailwind CSS 后，可以直接使用类名：

```tsx
<div className="bg-background text-foreground p-md rounded-md">
  <div className="bg-card p-lg rounded-lg border border-card-border">
    卡片内容
  </div>
  <button className="bg-primary text-primary-foreground px-lg py-sm rounded-md">
    按钮
  </button>
</div>
```

---

## 🔧 API 参考

### ThemeProvider Props

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;        // 默认主题名称，默认: 'default'
  enableStorage?: boolean;      // 是否启用 localStorage 持久化，默认: true
  storageKey?: string;          // localStorage 存储键名，默认: 'km-theme'
}
```

### useTheme Hook

```typescript
const {
  currentTheme,        // 当前主题名称
  themeConfig,         // 当前主题配置对象
  transformedTheme,    // 转换后的主题（包含 antd、cssVars、tailwind）
  switchTheme,         // 切换主题函数: (themeName: string) => void
  availableThemes,      // 可用主题列表: string[]
  isDarkMode,          // 是否为暗色模式（仅 Next.js）: boolean
} = useTheme();
```

### ThemeSwitcher Props

```typescript
interface ThemeSwitcherProps {
  type?: 'button' | 'dropdown';  // 显示类型，默认: 'dropdown'
  showIcon?: boolean;             // 是否显示图标，默认: true
  size?: 'small' | 'middle' | 'large';  // 按钮大小，默认: 'middle'
  className?: string;             // 自定义类名
}
```

---

## 📚 注册自定义主题

### 在 UmiJS 项目中

```typescript
// 在 app.tsx 或任何地方
import { registerTheme } from '@km-design/theme-system';
import customTheme from './themes/custom.json';

// 注册自定义主题
registerTheme('custom', customTheme);
```

### 在 Next.js 项目中

```typescript
// 在 layout.tsx 或任何客户端组件中
'use client';
import { registerTheme } from '@km-design/theme-system';
import customTheme from './themes/custom.json';

// 在组件挂载时注册
useEffect(() => {
  registerTheme('custom', customTheme);
}, []);
```

### 批量注册主题

```typescript
import { registerThemes } from '@km-design/theme-system';
import theme1 from './themes/theme1.json';
import theme2 from './themes/theme2.json';

registerThemes({
  'theme1': theme1,
  'theme2': theme2,
});
```

---

## 🎨 预设主题

包内置以下预设主题：

- `default` - 默认主题
- `dark` - 暗色主题
- `km-base` - KM 基础主题
- `spring-festival` - 春节主题
- `forest` - 森林主题
- `party` - 派对主题
- `red-theme` - 红色主题

### 使用预设主题

```typescript
// 直接切换
const { switchTheme } = useTheme();
switchTheme('dark');
switchTheme('spring-festival');
```

---

## 💡 最佳实践

### 1. 在应用根部使用 Provider

```typescript
// ✅ 正确：在应用根部
export function rootContainer(container) {
  return (
    <UmiThemeProvider defaultTheme="km-base">
      {container}
    </UmiThemeProvider>
  );
}

// ❌ 错误：不要在子组件中使用
function MyComponent() {
  return (
    <UmiThemeProvider>  // 不要这样做
      <div>...</div>
    </UmiThemeProvider>
  );
}
```

### 2. 使用 CSS Variables

```typescript
// ✅ 推荐：使用 CSS Variables
<div style={{ background: 'var(--background)' }}>

// ✅ 也可以：使用 Tailwind 类名
<div className="bg-background">

// ❌ 不推荐：硬编码颜色
<div style={{ background: '#ffffff' }}>  // 不会随主题变化
```

### 3. 主题切换器位置

```typescript
// ✅ 推荐：放在头部或设置页面
<Header>
  <ThemeSwitcher />
</Header>
```

---

## 🔍 调试技巧

### 检查当前主题

```typescript
const { currentTheme, themeConfig } = useTheme();
console.log('当前主题:', currentTheme);
console.log('主题配置:', themeConfig);
```

### 检查 CSS Variables

```javascript
// 在浏览器控制台
getComputedStyle(document.documentElement).getPropertyValue('--background');
getComputedStyle(document.documentElement).getPropertyValue('--primary');
```

### 检查可用主题

```typescript
const { availableThemes } = useTheme();
console.log('可用主题:', availableThemes);
```

---

## ❓ 常见问题

### Q: 如何添加新的预设主题？

**A**: 
1. 在 `packages/theme-system/src/presets/` 创建 JSON 文件
2. 重新构建包：`pnpm build`
3. UmiJS 会自动加载，Next.js 需要在适配器中注册

### Q: 如何自定义主题切换器样式？

**A**: 
1. 修改 `packages/theme-system/src/components/ThemeSwitcher.tsx`
2. 重新构建包：`pnpm build`
3. 或创建自己的主题切换器组件

### Q: 如何禁用主题持久化？

**A**: 
```typescript
<UmiThemeProvider 
  defaultTheme="km-base"
  enableStorage={false}  // 禁用持久化
>
  {children}
</UmiThemeProvider>
```

### Q: 如何获取主题的特定颜色？

**A**: 
```typescript
const { themeConfig } = useTheme();
const primaryColor = themeConfig?.colors?.primary?.[500];
const backgroundColor = themeConfig?.colors?.semantic?.background;
```

### Q: 如何在非 React 组件中使用主题？

**A**: 
```typescript
// 使用 CSS Variables（推荐）
const bgColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--background');
```

---

## 📞 获取帮助

- 查看 [README.md](./README.md) - 基础使用说明
- 查看 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - 开发指南
- 查看 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - 快速参考

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0

