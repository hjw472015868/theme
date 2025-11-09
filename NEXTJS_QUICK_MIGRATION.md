# Next.js 项目快速迁移指南

## 🎯 目标

将 `/Users/yylq/Desktop/kmflowui/km-flow-ui` 项目的主题系统替换为 `@km-design/theme-system` 包。

---

## ⚡ 快速迁移（5 步）

### 步骤 1: 安装包

```bash
# 方式 A: 使用本地链接（推荐）
cd /Users/yylq/Desktop/brainstorming-css-ux/km-artizen-ui/packages/theme-system
pnpm link --global

cd /Users/yylq/Desktop/kmflowui/km-flow-ui
pnpm link --global @km-design/theme-system
pnpm install
```

### 步骤 2: 备份当前主题

```bash
cd /Users/yylq/Desktop/kmflowui/km-flow-ui
cp -r theme theme.backup
```

### 步骤 3: 更新 ThemeWrapper

替换 `theme/theme-wrapper.tsx` 内容：

```typescript
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

### 步骤 4: 更新导入路径

```bash
cd /Users/yylq/Desktop/kmflowui/km-flow-ui

# 替换 theme-selector 中的导入
sed -i '' "s|from '@/theme'|from '@km-design/theme-system'|g" app/components/header/theme-selector/index.tsx
```

### 步骤 5: 测试验证

```bash
pnpm dev
```

访问项目，验证主题切换功能是否正常。

---

## 📝 详细说明

### 需要修改的文件

1. **theme/theme-wrapper.tsx** - 替换为新包
2. **app/components/header/theme-selector/index.tsx** - 更新导入路径

### 导入路径替换

**之前**:
```typescript
import { useTheme, ThemeEditor } from '@/theme';
```

**之后**:
```typescript
import { useTheme, ThemeEditor } from '@km-design/theme-system';
```

---

## ✅ 验证清单

- [ ] 包已安装（`node_modules/@km-design/theme-system` 存在）
- [ ] ThemeWrapper 已更新
- [ ] 导入路径已替换
- [ ] 项目能正常启动
- [ ] 主题切换功能正常
- [ ] CSS Variables 正确应用
- [ ] 无控制台错误

---

## 🐛 如果遇到问题

### 问题 1: 找不到包

```bash
# 重新链接
cd /Users/yylq/Desktop/brainstorming-css-ux/km-artizen-ui/packages/theme-system
pnpm link --global

cd /Users/yylq/Desktop/kmflowui/km-flow-ui
pnpm link --global @km-design/theme-system
```

### 问题 2: 主题切换不工作

检查 `NextThemeProvider` 是否正确使用，确保使用了 `'use client'` 指令。

### 问题 3: 样式不正确

检查 CSS Variables 是否正确应用：
```javascript
// 在浏览器控制台
getComputedStyle(document.documentElement).getPropertyValue('--background');
```

---

## 🔄 回滚（如果需要）

```bash
# 恢复备份
cd /Users/yylq/Desktop/kmflowui/km-flow-ui
rm -rf theme
cp -r theme.backup theme

# 恢复导入路径
git checkout app/components/header/theme-selector/index.tsx
```

---

## 📚 更多信息

- [详细迁移指南](./NEXTJS_MIGRATION_GUIDE.md) - 完整的迁移步骤
- [迁移步骤](./NEXTJS_MIGRATION_STEPS.md) - 详细的步骤说明
- [使用指南](./USAGE_GUIDE.md) - 如何使用主题包

---

**最后更新**: 2025-01-14

