# 迁移实施指南

本文档提供详细的步骤，指导如何将现有项目的主题系统迁移到 `@km-design/theme-system` 包。

## 📋 迁移前准备

### 1. 确认当前主题系统结构

检查你的项目中的主题系统：

- **UmiJS 项目**: `src/theme/`
- **Next.js 项目**: `theme/`

确保以下文件存在：
- `tokens/types.ts` - 类型定义
- `transformer/index.ts` - 转换器
- `provider/ThemeProvider.tsx` - 主题提供者
- `components/ThemeSwitcher.tsx` - 主题切换器
- `presets/*.json` - 预设主题文件

### 2. 备份当前代码

```bash
# 创建备份
cp -r src/theme src/theme.backup
# 或
cp -r theme theme.backup
```

---

## 🔧 步骤一：创建包并复制核心文件

### 1. 复制核心文件到包

从现有项目复制以下文件到 `packages/theme-system/src/`：

```bash
# 从 UmiJS 项目复制（作为主要来源）
cp -r apps/km-artizen-ai-ui/src/theme/tokens packages/theme-system/src/
cp -r apps/km-artizen-ai-ui/src/theme/transformer packages/theme-system/src/
cp -r apps/km-artizen-ai-ui/src/theme/components packages/theme-system/src/
cp -r apps/km-artizen-ai-ui/src/theme/presets packages/theme-system/src/
```

### 2. 创建核心 ThemeProvider

创建 `packages/theme-system/src/provider/ThemeProvider.tsx`，合并两个项目的实现：

**关键点**：
- 移除 `require.context` 相关代码（将在适配器中处理）
- 添加 SSR 安全检查（`typeof window !== 'undefined'`）
- 保持 API 兼容性

### 3. 创建适配器

#### UmiJS 适配器 (`src/provider/umi-adapter.tsx`)

```typescript
import React, { useEffect } from 'react';
import { ThemeProvider, registerThemes } from './ThemeProvider';

// 声明 require.context 类型
interface RequireContext {
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
}

declare const require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
  ): RequireContext;
};

// 自动加载预设主题
const loadPresetThemes = (): Record<string, any> => {
  const themes: Record<string, any> = {};
  
  try {
    const themeContext = require.context('../presets', false, /\.json$/);
    themeContext.keys().forEach((filename: string) => {
      const themeName = filename.replace(/^\.\//, '').replace(/\.json$/, '');
      const themeConfig = themeContext(filename);
      themes[themeName] = themeConfig;
    });
  } catch (error) {
    console.warn('Failed to load themes from context:', error);
  }
  
  return themes;
};

export interface UmiThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableStorage?: boolean;
  storageKey?: string;
}

export const UmiThemeProvider: React.FC<UmiThemeProviderProps> = ({
  children,
  ...props
}) => {
  useEffect(() => {
    const themes = loadPresetThemes();
    registerThemes(themes);
  }, []);

  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
```

#### Next.js 适配器 (`src/provider/nextjs-adapter.tsx`)

```typescript
'use client';

import React, { useEffect } from 'react';
import { ThemeProvider, registerThemes } from './ThemeProvider';

// 静态导入预设主题
import defaultTheme from '../presets/default.json';
import darkTheme from '../presets/dark.json';
import lightTheme from '../presets/light.json';
import springFestivalTheme from '../presets/spring-festival.json';

export interface NextThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableStorage?: boolean;
  storageKey?: string;
}

export const NextThemeProvider: React.FC<NextThemeProviderProps> = ({
  children,
  ...props
}) => {
  useEffect(() => {
    registerThemes({
      default: defaultTheme,
      dark: darkTheme,
      light: lightTheme,
      'spring-festival': springFestivalTheme,
    });
  }, []);

  return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
```

---

## 🚀 步骤二：UmiJS 项目迁移

### 1. 安装包依赖

```bash
cd apps/km-artizen-ai-ui
pnpm add @km-design/theme-system
```

### 2. 更新 app.tsx

```typescript
// 之前
import { ThemeProvider } from '@/theme';

export function rootContainer(container: React.ReactElement) {
  return (
    <ThemeProvider defaultTheme="km-base">
      {container}
    </ThemeProvider>
  );
}

// 之后
import { UmiThemeProvider } from '@km-design/theme-system';

export function rootContainer(container: React.ReactElement) {
  return (
    <UmiThemeProvider defaultTheme="km-base">
      {container}
    </UmiThemeProvider>
  );
}
```

### 3. 更新组件导入

```typescript
// 之前
import { useTheme, ThemeSwitcher } from '@/theme';

// 之后
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';
```

### 4. 删除本地主题目录（可选，建议先保留一段时间）

```bash
# 先注释掉，确认一切正常后再删除
# rm -rf src/theme
```

### 5. 验证功能

- ✅ 主题切换正常
- ✅ CSS Variables 正确应用
- ✅ Ant Design 组件样式正确
- ✅ Tailwind CSS 类名正常工作

---

## 🚀 步骤三：Next.js 项目迁移

### 1. 安装包依赖

```bash
cd /Users/yylq/Desktop/kmflowui/km-flow-ui
pnpm add @km-design/theme-system
```

### 2. 更新 ThemeWrapper

```typescript
// theme/theme-wrapper.tsx
'use client';
import { NextThemeProvider } from '@km-design/theme-system';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider 
      defaultTheme="light"
      enableStorage={true}
      storageKey="km-flow-theme"
    >
      {children}
    </NextThemeProvider>
  );
}
```

### 3. 更新组件导入

```typescript
// 之前
import { useTheme, ThemeSwitcher } from '@/theme';

// 之后
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';
```

### 4. 更新 layout.tsx（如果直接使用）

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

### 5. 删除本地主题目录（可选）

```bash
# 先注释掉，确认一切正常后再删除
# rm -rf theme
```

### 6. 验证功能

- ✅ 主题切换正常
- ✅ SSR 无闪烁问题
- ✅ CSS Variables 正确应用
- ✅ Ant Design 组件样式正确

---

## 🔍 步骤四：测试和验证

### 功能测试清单

- [ ] 主题切换功能正常
- [ ] 主题持久化（localStorage）正常
- [ ] CSS Variables 正确应用到 DOM
- [ ] Ant Design 组件样式正确
- [ ] Tailwind CSS 类名正常工作
- [ ] 主题编辑器（如果使用）正常工作
- [ ] SSR（Next.js）无闪烁问题
- [ ] 控制台无错误和警告

### 性能测试

- [ ] 包体积合理（< 100KB gzipped）
- [ ] 首次加载时间无显著增加
- [ ] 主题切换响应时间 < 100ms

### 兼容性测试

- [ ] Chrome/Edge 最新版本
- [ ] Firefox 最新版本
- [ ] Safari 最新版本
- [ ] 移动端浏览器

---

## 🐛 常见问题

### 1. 主题未加载

**问题**: 切换主题后样式没有变化

**解决方案**:
- 检查是否正确安装了包
- 检查 ThemeProvider 是否正确包裹应用
- 检查控制台是否有错误信息

### 2. SSR 闪烁问题（Next.js）

**问题**: 页面首次加载时出现样式闪烁

**解决方案**:
- 确保 NextThemeProvider 正确使用 `'use client'` 指令
- 检查 SSR 安全检查是否到位
- 考虑使用 `suppressHydrationWarning` 属性

### 3. require.context 错误（UmiJS）

**问题**: 构建时出现 require.context 相关错误

**解决方案**:
- 确保使用 UmiThemeProvider 而不是直接使用 ThemeProvider
- 检查 webpack 配置是否正确支持 require.context

### 4. 类型错误

**问题**: TypeScript 类型检查失败

**解决方案**:
- 确保安装了 `@km-design/theme-system` 包
- 检查 `tsconfig.json` 中的类型解析配置
- 运行 `pnpm type-check` 检查类型

---

## 📝 迁移后清理

### 1. 删除备份

确认一切正常后，删除备份文件：

```bash
rm -rf src/theme.backup
# 或
rm -rf theme.backup
```

### 2. 更新文档

更新项目文档，说明使用新的主题包：

```markdown
## 主题系统

本项目使用 `@km-design/theme-system` 统一主题包。

### 使用方式

```typescript
import { useTheme, ThemeSwitcher } from '@km-design/theme-system';
```
```

### 3. 更新 CI/CD

如果 CI/CD 流程中有主题相关的构建步骤，需要更新：

```yaml
# 之前可能需要构建本地主题
# - run: npm run build:theme

# 之后使用包，无需额外构建
```

---

## 🎉 完成

迁移完成后，你将获得：

1. ✅ **统一管理**: 所有主题配置集中在一个包中
2. ✅ **自动同步**: 修改主题包后，所有项目通过更新依赖即可同步
3. ✅ **易于维护**: 不再需要在多个项目中复制和维护相同的代码
4. ✅ **版本控制**: 通过 npm 版本管理，可以回滚到任意版本

---

## 📞 获取帮助

如果遇到问题，请：

1. 查看 [README.md](./README.md)
2. 查看 [迁移方案文档](../../docs/主题系统统一包迁移方案.md)
3. 检查控制台错误信息
4. 联系维护团队

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0

