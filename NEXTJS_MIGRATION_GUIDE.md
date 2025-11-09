# Next.js 项目迁移指南

## 📋 迁移目标

将 `/Users/yylq/Desktop/kmflowui/km-flow-ui` 项目中的本地主题系统替换为 `@km-design/theme-system` 包。

---

## 🔍 当前状态分析

### 当前使用情况

1. **ThemeWrapper**: `theme/theme-wrapper.tsx`
   - 使用 `ThemeProvider` 和 `registerThemes`
   - 在 `app/layout.tsx` 中使用

2. **导入路径**: `@/theme`
   - 所有组件从 `@/theme` 导入

3. **主题选择器**: `app/components/header/theme-selector/index.tsx`
   - 使用 `useTheme` 和 `ThemeEditor`

4. **预设主题**: `theme/presets/`
   - `default.json`
   - `light.json`
   - `dark.json`
   - `festival-spring.json`

---

## 🚀 迁移步骤（渐进式，不影响现有功能）

### 阶段一：安装包（不影响现有功能）

#### 1. 安装包

```bash
cd /Users/yylq/Desktop/kmflowui/km-flow-ui

# 方式一：如果项目可以添加到 monorepo，使用 workspace
# 在 package.json 中添加：
# "@km-design/theme-system": "workspace:*"

# 方式二：使用本地链接（推荐用于测试）
cd /Users/yylq/Desktop/brainstorming-css-ux/km-artizen-ui/packages/theme-system
pnpm link --global

cd /Users/yylq/Desktop/kmflowui/km-flow-ui
pnpm link --global @km-design/theme-system

# 方式三：使用相对路径（临时）
# 在 package.json 中添加：
# "@km-design/theme-system": "file:../../brainstorming-css-ux/km-artizen-ui/packages/theme-system"
```

#### 2. 验证安装

```bash
# 检查包是否存在
ls node_modules/@km-design/theme-system

# 应该看到：
# - dist/
# - presets/
# - package.json
```

---

### 阶段二：创建测试页面（验证新包）

#### 1. 创建测试页面

```bash
mkdir -p app/test-theme
```

创建 `app/test-theme/page.tsx`:

```typescript
'use client';
import { NextThemeProvider, useTheme, ThemeSwitcher } from '@km-design/theme-system';

function TestContent() {
  const { currentTheme, switchTheme, availableThemes } = useTheme();
  
  return (
    <div style={{ padding: '24px', background: 'var(--background)', minHeight: '100vh' }}>
      <h1>主题包测试页面</h1>
      <div style={{ marginTop: '24px' }}>
        <p>当前主题: {currentTheme}</p>
        <ThemeSwitcher />
        <div style={{ marginTop: '16px' }}>
          {availableThemes.map(theme => (
            <button
              key={theme}
              onClick={() => switchTheme(theme)}
              style={{
                margin: '8px',
                padding: '8px 16px',
                background: currentTheme === theme ? 'var(--primary)' : 'var(--card)',
                color: currentTheme === theme ? 'var(--primary-foreground)' : 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestThemePage() {
  return (
    <NextThemeProvider defaultTheme="light">
      <TestContent />
    </NextThemeProvider>
  );
}
```

#### 2. 访问测试页面

```bash
# 启动项目
pnpm dev

# 访问测试页面
# http://localhost:3000/test-theme
```

#### 3. 验证功能

- [ ] 测试页面正常加载
- [ ] 主题切换功能正常
- [ ] CSS Variables 正确应用
- [ ] Ant Design 组件样式正确

---

### 阶段三：逐步替换（可选）

#### 方案 A：双轨运行（推荐，风险最小）

创建新的 `ThemeWrapper`，保留旧的：

```typescript
// theme/theme-wrapper-new.tsx
'use client';
import { NextThemeProvider } from '@km-design/theme-system';

export function ThemeWrapperNew({ children }: { children: React.ReactNode }) {
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

在 `app/layout.tsx` 中使用环境变量控制：

```typescript
// app/layout.tsx
import { ThemeWrapper } from '@/theme';  // 旧的
import { ThemeWrapperNew } from '@/theme/theme-wrapper-new';  // 新的

const USE_NEW_THEME = process.env.NEXT_PUBLIC_USE_NEW_THEME === 'true';

export default function LocaleLayout({ children }) {
  return (
    <html>
      <body>
        {USE_NEW_THEME ? (
          <ThemeWrapperNew>
            {children}
          </ThemeWrapperNew>
        ) : (
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        )}
      </body>
    </html>
  );
}
```

#### 方案 B：直接替换（确认无误后）

---

### 阶段四：完全替换（确认无误后）

#### 1. 更新 ThemeWrapper

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

#### 2. 更新导入路径

查找所有使用 `@/theme` 的文件：

```bash
# 查找所有导入
grep -r "from '@/theme'" app/
```

需要替换的文件：
- `app/components/header/theme-selector/index.tsx`
- 其他使用主题的组件

#### 3. 替换导入

```typescript
// 之前
import { useTheme, ThemeEditor } from '@/theme';

// 之后
import { useTheme, ThemeEditor } from '@km-design/theme-system';
```

---

## 📝 详细迁移步骤

### 步骤 1: 安装包

```bash
cd /Users/yylq/Desktop/kmflowui/km-flow-ui

# 使用本地链接（推荐用于开发）
cd /Users/yylq/Desktop/brainstorming-css-ux/km-artizen-ui/packages/theme-system
pnpm link --global

cd /Users/yylq/Desktop/kmflowui/km-flow-ui
pnpm link --global @km-design/theme-system
```

### 步骤 2: 创建新的 ThemeWrapper

```typescript
// theme/theme-wrapper-new.tsx
'use client';
import { NextThemeProvider } from '@km-design/theme-system';

export function ThemeWrapperNew({ children }: { children: React.ReactNode }) {
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

### 步骤 3: 更新 layout.tsx（双轨运行）

```typescript
// app/layout.tsx
import { ThemeWrapper } from '@/theme';
import { ThemeWrapperNew } from '@/theme/theme-wrapper-new';

// 使用环境变量控制（或直接切换）
const USE_NEW_THEME = process.env.NEXT_PUBLIC_USE_NEW_THEME === 'true';

export default function LocaleLayout({ children }) {
  return (
    <html>
      <body>
        {USE_NEW_THEME ? (
          <ThemeWrapperNew>{children}</ThemeWrapperNew>
        ) : (
          <ThemeWrapper>{children}</ThemeWrapper>
        )}
      </body>
    </html>
  );
}
```

### 步骤 4: 测试验证

1. 设置环境变量：
   ```bash
   # .env.local
   NEXT_PUBLIC_USE_NEW_THEME=true
   ```

2. 启动项目：
   ```bash
   pnpm dev
   ```

3. 验证功能：
   - 主题切换正常
   - CSS Variables 正确应用
   - Ant Design 组件样式正确
   - 主题持久化正常

### 步骤 5: 更新组件导入

#### 更新 theme-selector

```typescript
// app/components/header/theme-selector/index.tsx
// 之前
import { useTheme, ThemeEditor } from '@/theme';

// 之后
import { useTheme, ThemeEditor } from '@km-design/theme-system';
```

#### 查找并替换所有导入

```bash
# 查找所有使用 @/theme 的文件
grep -r "from '@/theme'" app/ --include="*.tsx" --include="*.ts"

# 批量替换（谨慎使用）
find app/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' "s|from '@/theme'|from '@km-design/theme-system'|g" {} \;
```

### 步骤 6: 完全切换

确认一切正常后：

1. **更新 ThemeWrapper**
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

2. **删除旧的 ThemeWrapper（可选）**
   ```bash
   # 先备份
   cp theme/theme-wrapper.tsx theme/theme-wrapper.tsx.backup
   
   # 然后更新为新版本
   ```

3. **删除环境变量控制**
   ```typescript
   // app/layout.tsx
   import { ThemeWrapper } from '@/theme';
   
   export default function LocaleLayout({ children }) {
     return (
       <html>
         <body>
           <ThemeWrapper>
             {children}
           </ThemeWrapper>
         </body>
       </html>
     );
   }
   ```

### 步骤 7: 删除旧的主题目录（最后一步）

**只有在完全确认新包功能正常后，才删除**：

```bash
# 先备份
cp -r theme theme.backup

# 确认一切正常后，删除
rm -rf theme
```

---

## 🔄 导入路径替换清单

需要替换导入的文件：

- [ ] `app/layout.tsx` - 已使用 ThemeWrapper，无需直接导入
- [ ] `app/components/header/theme-selector/index.tsx` - 需要替换
- [ ] 其他使用 `@/theme` 的组件

### 批量替换脚本

```bash
# 查找所有需要替换的文件
grep -r "from '@/theme'" app/ --include="*.tsx" --include="*.ts" -l

# 手动替换或使用 sed（谨慎）
find app/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' "s|from '@/theme'|from '@km-design/theme-system'|g" {} \;
```

---

## ✅ 验证清单

### 功能验证

- [ ] 主题切换功能正常
- [ ] 所有主题都能正常加载
- [ ] CSS Variables 正确应用到 DOM
- [ ] Ant Design 组件样式正确
- [ ] 主题持久化（localStorage）正常
- [ ] SSR 无闪烁问题

### 兼容性验证

- [ ] 所有页面正常显示
- [ ] 无控制台错误
- [ ] 无样式闪烁
- [ ] 性能无影响

### 对比验证

- [ ] 新包功能与旧系统一致
- [ ] 样式完全一致
- [ ] 行为完全一致

---

## 🐛 问题排查

### 问题 1: 主题未加载

**症状**: 切换主题后样式没有变化

**解决方案**:
1. 检查 `NextThemeProvider` 是否正确使用
2. 检查控制台是否有错误
3. 检查主题是否注册：
   ```typescript
   // Next.js 适配器会自动注册预设主题
   // 如果使用自定义主题，需要手动注册
   ```

### 问题 2: SSR 闪烁

**症状**: 页面首次加载时出现样式闪烁

**解决方案**:
1. 确保 `NextThemeProvider` 使用了 `'use client'` 指令
2. 检查 SSR 安全检查是否到位
3. 考虑使用 `suppressHydrationWarning` 属性

### 问题 3: 导入错误

**症状**: `Module not found: Can't resolve '@km-design/theme-system'`

**解决方案**:
1. 检查包是否正确安装：
   ```bash
   ls node_modules/@km-design/theme-system
   ```
2. 重新安装依赖：
   ```bash
   pnpm install
   ```
3. 检查 package.json 中的依赖配置

---

## 📝 迁移后清理

### 1. 删除备份

确认一切正常后，删除备份文件：

```bash
rm -rf theme.backup
rm -rf theme/theme-wrapper.tsx.backup
```

### 2. 更新文档

更新项目文档，说明使用新的主题包。

### 3. 更新 CI/CD

如果 CI/CD 流程中有主题相关的构建步骤，需要更新。

---

## 🎯 关键差异

### API 差异

| 旧 API | 新 API | 说明 |
|--------|--------|------|
| `ThemeProvider` | `NextThemeProvider` | Next.js 专用适配器 |
| `registerThemes` | 自动注册 | Next.js 适配器自动注册预设主题 |
| `@/theme` | `@km-design/theme-system` | 导入路径 |

### 使用差异

**之前**:
```typescript
import { ThemeProvider, registerThemes } from '@/theme';
import defaultTheme from '@/theme/presets/default.json';

registerThemes({
  default: defaultTheme,
});

<ThemeProvider defaultTheme="light">
  {children}
</ThemeProvider>
```

**之后**:
```typescript
import { NextThemeProvider } from '@km-design/theme-system';

// 无需手动注册，适配器自动处理
<NextThemeProvider defaultTheme="light">
  {children}
</NextThemeProvider>
```

---

## 📚 相关文档

- [使用指南](./USAGE_GUIDE.md) - 详细的使用说明
- [安全迁移指南](./SAFE_MIGRATION_GUIDE.md) - 渐进式迁移步骤
- [开发指南](./DEVELOPMENT_GUIDE.md) - 如何开发和更新主题组件

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0

