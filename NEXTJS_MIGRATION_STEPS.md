# Next.js 项目迁移步骤（详细版）

## 🎯 迁移目标项目

**项目路径**: `/Users/yylq/Desktop/kmflowui/km-flow-ui`

**当前状态**: 使用本地复制的主题系统（从 UmiJS 项目复制并修改）

**目标**: 替换为 `@km-design/theme-system` 统一包

---

## 📋 迁移前准备

### 1. 备份当前主题系统

```bash
cd /Users/yylq/Desktop/kmflowui/km-flow-ui

# 备份整个 theme 目录
cp -r theme theme.backup
```

### 2. 检查当前使用情况

```bash
# 查找所有使用主题的文件
grep -r "from '@/theme'" app/ --include="*.tsx" --include="*.ts"
```

---

## 🚀 迁移步骤

### 步骤 1: 安装包

#### 方式 A: 使用本地链接（推荐用于开发测试）

```bash
# 1. 在主题包目录中创建全局链接
cd /Users/yylq/Desktop/brainstorming-css-ux/km-artizen-ui/packages/theme-system
pnpm link --global

# 2. 在 Next.js 项目中链接
cd /Users/yylq/Desktop/kmflowui/km-flow-ui
pnpm link --global @km-design/theme-system

# 3. 安装依赖
pnpm install
```

#### 方式 B: 使用相对路径（临时）

在 `package.json` 中添加：

```json
{
  "dependencies": {
    "@km-design/theme-system": "file:../../brainstorming-css-ux/km-artizen-ui/packages/theme-system"
  }
}
```

然后：

```bash
pnpm install
```

#### 方式 C: 添加到 Monorepo（如果可能）

如果可以将 Next.js 项目添加到 monorepo：

1. 在 `pnpm-workspace.yaml` 中添加项目路径
2. 使用 `workspace:*` 协议

---

### 步骤 2: 创建新的 ThemeWrapper（不删除旧的）

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

---

### 步骤 3: 更新 layout.tsx（双轨运行）

```typescript
// app/layout.tsx
import { ThemeWrapper } from '@/theme';  // 旧的
import { ThemeWrapperNew } from '@/theme/theme-wrapper-new';  // 新的

// 使用环境变量控制（或直接设为 true 测试）
const USE_NEW_THEME = process.env.NEXT_PUBLIC_USE_NEW_THEME === 'true';

export default function LocaleLayout({ children }) {
  return (
    <html lang={locale ?? 'en'} className="h-full" data-theme="light">
      <body>
        {USE_NEW_THEME ? (
          <ThemeWrapperNew>
            <Topbar />
            <FlowParamsInitializer />
            <BrowserInitor>
              <SentryInitor>
                <I18nServer>{children}</I18nServer>
              </SentryInitor>
            </BrowserInitor>
          </ThemeWrapperNew>
        ) : (
          <ThemeWrapper>
            <Topbar />
            <FlowParamsInitializer />
            <BrowserInitor>
              <SentryInitor>
                <I18nServer>{children}</I18nServer>
              </SentryInitor>
            </BrowserInitor>
          </ThemeWrapper>
        )}
      </body>
    </html>
  );
}
```

---

### 步骤 4: 创建测试页面（可选）

```typescript
// app/test-theme/page.tsx
'use client';
import { NextThemeProvider, useTheme, ThemeSwitcher } from '@km-design/theme-system';

function TestContent() {
  const { currentTheme, availableThemes } = useTheme();
  
  return (
    <div style={{ padding: '24px' }}>
      <h1>主题包测试</h1>
      <p>当前主题: {currentTheme}</p>
      <ThemeSwitcher />
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

---

### 步骤 5: 测试验证

#### 1. 设置环境变量

创建或更新 `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_USE_NEW_THEME=true
```

#### 2. 启动项目

```bash
pnpm dev
```

#### 3. 验证功能

访问项目，验证：
- [ ] 页面正常加载
- [ ] 主题切换功能正常
- [ ] CSS Variables 正确应用
- [ ] Ant Design 组件样式正确
- [ ] 控制台无错误

#### 4. 对比测试

- 访问现有页面（使用旧系统）：设置 `NEXT_PUBLIC_USE_NEW_THEME=false`
- 访问现有页面（使用新包）：设置 `NEXT_PUBLIC_USE_NEW_THEME=true`
- 对比功能是否一致

---

### 步骤 6: 更新组件导入

#### 更新 theme-selector

```typescript
// app/components/header/theme-selector/index.tsx
// 之前
import { useTheme, ThemeEditor } from '@/theme';

// 之后
import { useTheme, ThemeEditor } from '@km-design/theme-system';
```

#### 查找所有需要替换的文件

```bash
# 查找所有使用 @/theme 的文件
grep -r "from '@/theme'" app/ --include="*.tsx" --include="*.ts" -l
```

#### 批量替换（谨慎）

```bash
# 先备份
git add .
git commit -m "备份：迁移前状态"

# 替换导入路径
find app/ -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' "s|from '@/theme'|from '@km-design/theme-system'|g" {} \;
```

---

### 步骤 7: 完全切换（确认无误后）

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

#### 2. 更新 layout.tsx

```typescript
// app/layout.tsx
import { ThemeWrapper } from '@/theme';

export default function LocaleLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeWrapper>
          <Topbar />
          <FlowParamsInitializer />
          <BrowserInitor>
            <SentryInitor>
              <I18nServer>{children}</I18nServer>
            </SentryInitor>
          </BrowserInitor>
        </ThemeWrapper>
      </body>
    </html>
  );
}
```

#### 3. 删除环境变量控制

删除 `.env.local` 中的 `NEXT_PUBLIC_USE_NEW_THEME`

#### 4. 删除旧的 ThemeWrapper（可选）

```bash
# 删除测试用的新 ThemeWrapper
rm theme/theme-wrapper-new.tsx
```

---

### 步骤 8: 删除旧的主题目录（最后一步）

**只有在完全确认新包功能正常后，才删除**：

```bash
# 确认一切正常后
rm -rf theme
```

**注意**: 
- 保留 `theme.backup` 作为备份
- 确认所有功能正常后再删除备份

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

## 🔍 关键文件清单

需要修改的文件：

1. **package.json** - 添加依赖
2. **app/layout.tsx** - 更新 ThemeWrapper
3. **theme/theme-wrapper.tsx** - 替换为新包
4. **app/components/header/theme-selector/index.tsx** - 更新导入
5. **其他使用 `@/theme` 的组件** - 更新导入

---

## 🐛 常见问题

### Q: 主题切换不工作？

**A**: 
1. 检查 `NextThemeProvider` 是否正确使用
2. 检查控制台是否有错误
3. 检查主题是否自动注册（Next.js 适配器会自动注册）

### Q: SSR 闪烁问题？

**A**: 
1. 确保 `NextThemeProvider` 使用了 `'use client'` 指令
2. 检查 SSR 安全检查是否到位

### Q: 导入路径错误？

**A**: 
1. 检查包是否正确安装
2. 检查 package.json 中的依赖配置

---

## 📝 迁移记录模板

```
迁移日期: 2025-01-14
迁移人员: [你的名字]

步骤完成情况:
- [ ] 步骤 1: 安装包
- [ ] 步骤 2: 创建新的 ThemeWrapper
- [ ] 步骤 3: 更新 layout.tsx（双轨运行）
- [ ] 步骤 4: 创建测试页面
- [ ] 步骤 5: 测试验证
- [ ] 步骤 6: 更新组件导入
- [ ] 步骤 7: 完全切换
- [ ] 步骤 8: 删除旧的主题目录

测试结果:
- [ ] 功能测试通过
- [ ] 兼容性测试通过
- [ ] 性能测试通过

问题记录:
[记录遇到的问题和解决方案]

结论: [通过/不通过]
```

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0

