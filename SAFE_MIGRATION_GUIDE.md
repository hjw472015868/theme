# 安全迁移指南 - 渐进式迁移方案

## 🎯 目标

确保迁移过程中**不影响现有功能**，采用渐进式迁移策略，每一步都可以回滚。

---

## 📋 迁移策略：双轨并行

### 核心思想

在迁移过程中，**同时保留旧的主题系统和新的包**，逐步切换，确保每一步都可以验证和回滚。

---

## 🚀 阶段一：准备阶段（不影响现有功能）

### 1.1 创建包结构（已完成）

✅ 包的基础结构已创建在 `packages/theme-system/`

### 1.2 复制核心文件（不删除原文件）

```bash
# 复制文件到包中（保留原文件）
cp -r apps/km-artizen-ai-ui/src/theme/tokens packages/theme-system/src/
cp -r apps/km-artizen-ai-ui/src/theme/transformer packages/theme-system/src/
cp -r apps/km-artizen-ai-ui/src/theme/components packages/theme-system/src/
cp -r apps/km-artizen-ai-ui/src/theme/presets packages/theme-system/src/
```

**重要**: 此时**不删除**原项目中的 `src/theme/` 目录，保持现有功能正常。

### 1.3 实现适配器

创建适配器文件，但**暂时不集成到项目中**。

---

## 🔄 阶段二：并行运行（验证新包）

### 2.1 安装包但不使用

```bash
# 在 UmiJS 项目中
cd apps/km-artizen-ai-ui
pnpm add @km-design/theme-system
```

**关键**: 此时**不修改**任何现有代码，只是安装包。

### 2.2 创建测试页面

创建一个独立的测试页面，使用新包：

```typescript
// src/pages/test-theme/index.tsx
import { UmiThemeProvider, useTheme, ThemeSwitcher } from '@km-design/theme-system';

const TestThemePage = () => {
  const { currentTheme, switchTheme } = useTheme();
  
  return (
    <div>
      <h1>主题包测试页面</h1>
      <ThemeSwitcher />
      <p>当前主题: {currentTheme}</p>
    </div>
  );
};

// 在测试页面中使用新包
export default function TestTheme() {
  return (
    <UmiThemeProvider defaultTheme="km-base">
      <TestThemePage />
    </UmiThemeProvider>
  );
}
```

**验证点**:
- ✅ 新包功能是否正常
- ✅ 主题切换是否正常
- ✅ CSS Variables 是否正确应用
- ✅ Ant Design 样式是否正确

### 2.3 对比测试

同时访问：
- 原有页面（使用旧的主题系统）
- 测试页面（使用新的包）

对比功能是否一致。

---

## 🔀 阶段三：逐步切换（可选）

### 3.1 方案 A：保持双轨运行（推荐）

**不删除旧代码**，让新旧系统并行运行：

```typescript
// app.tsx
import { ThemeProvider as OldThemeProvider } from '@/theme';
import { UmiThemeProvider as NewThemeProvider } from '@km-design/theme-system';

// 使用环境变量或配置控制使用哪个
const USE_NEW_THEME = process.env.USE_NEW_THEME === 'true';

export function rootContainer(container: React.ReactElement) {
  if (USE_NEW_THEME) {
    return (
      <NewThemeProvider defaultTheme="km-base">
        {container}
      </NewThemeProvider>
    );
  }
  
  // 默认使用旧系统
  return (
    <OldThemeProvider defaultTheme="km-base">
      {container}
    </OldThemeProvider>
  );
}
```

**优点**:
- ✅ 可以随时切换回旧系统
- ✅ 可以逐步验证
- ✅ 风险最小

### 3.2 方案 B：完全切换（确认无误后）

只有在**完全确认新包功能正常**后，才进行完全切换：

```typescript
// app.tsx
// 删除旧导入
// import { ThemeProvider } from '@/theme';

// 使用新包
import { UmiThemeProvider as ThemeProvider } from '@km-design/theme-system';

export function rootContainer(container: React.ReactElement) {
  return (
    <ThemeProvider defaultTheme="km-base">
      {container}
    </ThemeProvider>
  );
}
```

---

## 🛡️ 回滚方案

### 如果发现问题，立即回滚

#### 方案 A：切换回旧系统

```typescript
// app.tsx
// 注释掉新包
// import { UmiThemeProvider } from '@km-design/theme-system';

// 恢复旧导入
import { ThemeProvider } from '@/theme';

export function rootContainer(container: React.ReactElement) {
  return (
    <ThemeProvider defaultTheme="km-base">
      {container}
    </ThemeProvider>
  );
}
```

#### 方案 B：使用 Git 回滚

```bash
# 回滚到迁移前的提交
git revert <commit-hash>
# 或
git reset --hard <commit-hash>
```

---

## ✅ 验证清单

在每一步迁移后，都要验证：

### 功能验证

- [ ] 主题切换功能正常
- [ ] 所有主题都能正常加载
- [ ] CSS Variables 正确应用到 DOM
- [ ] Ant Design 组件样式正确
- [ ] Tailwind CSS 类名正常工作
- [ ] 主题持久化（localStorage）正常

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

## 📝 迁移步骤总结

### UmiJS 项目迁移步骤

```bash
# 步骤 1: 安装包（不影响现有功能）
cd apps/km-artizen-ai-ui
pnpm add @km-design/theme-system

# 步骤 2: 创建测试页面验证
# 创建 src/pages/test-theme/index.tsx（使用新包）

# 步骤 3: 验证新包功能
# 访问测试页面，验证功能

# 步骤 4: 对比测试
# 对比新旧系统功能是否一致

# 步骤 5: 逐步切换（可选）
# 使用环境变量控制，或直接切换

# 步骤 6: 完全切换（确认无误后）
# 更新 app.tsx，使用新包

# 步骤 7: 删除旧代码（最后一步）
# 确认一切正常后，删除 src/theme/
```

### Next.js 项目迁移步骤

```bash
# 步骤 1: 安装包
cd /Users/yylq/Desktop/kmflowui/km-flow-ui
pnpm add @km-design/theme-system

# 步骤 2: 创建测试页面
# 创建 app/test-theme/page.tsx（使用新包）

# 步骤 3: 验证新包功能
# 访问测试页面，验证功能

# 步骤 4: 更新 ThemeWrapper（可选）
# 可以创建新的 ThemeWrapper，保留旧的

# 步骤 5: 逐步切换
# 使用配置控制使用哪个 ThemeWrapper

# 步骤 6: 完全切换
# 更新 ThemeWrapper，使用新包

# 步骤 7: 删除旧代码
# 确认一切正常后，删除 theme/
```

---

## 🔍 问题排查

### 如果新包不工作

1. **检查包是否正确构建**
   ```bash
   cd packages/theme-system
   pnpm build
   ```

2. **检查包是否正确安装**
   ```bash
   cd apps/km-artizen-ai-ui
   ls node_modules/@km-design/theme-system
   ```

3. **检查导入路径**
   ```typescript
   // 确保导入路径正确
   import { UmiThemeProvider } from '@km-design/theme-system';
   ```

4. **检查控制台错误**
   - 打开浏览器控制台
   - 查看是否有错误信息

### 如果样式不一致

1. **检查 CSS Variables**
   ```javascript
   // 在浏览器控制台
   getComputedStyle(document.documentElement).getPropertyValue('--background')
   ```

2. **检查 Ant Design 主题**
   - 使用 React DevTools
   - 检查 ConfigProvider 的 theme 属性

3. **对比新旧系统**
   - 同时打开两个页面
   - 对比样式差异

---

## 🎯 最佳实践

### 1. 渐进式迁移

- ✅ 不要一次性切换所有代码
- ✅ 先在小范围测试
- ✅ 逐步扩大范围
- ✅ 每一步都验证

### 2. 保留旧代码

- ✅ 在完全确认前，不删除旧代码
- ✅ 使用 Git 分支管理迁移
- ✅ 保留回滚能力

### 3. 充分测试

- ✅ 功能测试
- ✅ 兼容性测试
- ✅ 性能测试
- ✅ 用户体验测试

### 4. 文档记录

- ✅ 记录每一步操作
- ✅ 记录遇到的问题
- ✅ 记录解决方案

---

## 📞 获取帮助

如果遇到问题：

1. 查看控制台错误信息
2. 检查包是否正确构建
3. 对比新旧系统差异
4. 查看本文档的排查部分
5. 联系维护团队

---

**重要提示**: 
- ⚠️ **不要急于删除旧代码**
- ⚠️ **每一步都要充分验证**
- ⚠️ **保留回滚能力**
- ✅ **渐进式迁移，风险最小**

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0

