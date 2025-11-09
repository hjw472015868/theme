# 主题系统开发指南

## 📋 概述

本文档说明在迁移到 `@km-design/theme-system` 统一包后，如何开发和更新主题组件。

---

## 🏗️ 开发工作流程

### 1. 本地开发模式

#### 使用 workspace 链接（推荐）

在 monorepo 中，可以直接使用 workspace 协议：

```json
// apps/km-artizen-ai-ui/package.json
{
  "dependencies": {
    "@km-design/theme-system": "workspace:*"
  }
}
```

这样可以直接在 `packages/theme-system` 中修改代码，项目会自动使用最新版本。

#### 开发步骤

1. **修改主题包代码**

   ```bash
   cd packages/theme-system
   # 修改源代码
   ```

2. **构建包**

   ```bash
   pnpm build
   ```

3. **在项目中测试**

   ```bash
   cd apps/km-artizen-ai-ui
   # 项目会自动使用 workspace 中的包
   pnpm dev
   ```

4. **验证功能**
   - 检查主题切换是否正常
   - 检查样式是否正确应用
   - 检查控制台是否有错误

---

## 🎨 开发主题组件

### 1. 添加新主题

#### 步骤

1. **创建主题 JSON 文件**

   ```bash
   cd packages/theme-system/src/presets
   # 创建新主题文件，例如：ocean.json
   ```

2. **定义主题配置**

   ```json
   {
     "meta": {
       "name": "海洋主题",
       "version": "1.0.0",
       "author": "Your Name",
       "description": "清新的海洋风格主题",
       "mode": "light",
       "type": "default"
     },
     "colors": {
       "primary": {
         "50": "#e0f7fa",
         "100": "#b2ebf2"
         // ... 其他颜色
       }
       // ... 其他配置
     }
   }
   ```

3. **在适配器中注册（Next.js 需要）**

   ```typescript
   // src/provider/nextjs-adapter.tsx
   import oceanTheme from '../presets/ocean.json';

   registerThemes({
     // ... 其他主题
     ocean: oceanTheme,
   });
   ```

4. **UmiJS 自动加载**
   - UmiJS 使用 `require.context` 自动加载，无需手动注册
   - 确保文件在 `presets/` 目录下即可

5. **构建和测试**
   ```bash
   pnpm build
   # 在项目中测试新主题
   ```

### 2. 修改现有主题

#### 步骤

1. **找到主题文件**

   ```bash
   cd packages/theme-system/src/presets
   # 例如修改 default.json
   ```

2. **修改配置**

   ```json
   {
     "colors": {
       "primary": {
         "500": "#1890ff" // 修改主色
         // ...
       }
     }
   }
   ```

3. **构建包**

   ```bash
   pnpm build
   ```

4. **测试**
   - 在项目中切换到该主题
   - 验证样式变化

### 3. 修改转换器逻辑

如果需要修改主题转换逻辑（例如添加新的 CSS Variables）：

1. **修改转换器**

   ```typescript
   // src/transformer/index.ts
   public toCSSVariables(): CSSVariables {
     // 添加新的变量
     vars['--my-custom-var'] = this.config.colors.primary[500];
     return vars;
   }
   ```

2. **更新类型定义（如需要）**

   ```typescript
   // src/tokens/types.ts
   export interface ThemeConfig {
     // 添加新字段
     customConfig?: {
       // ...
     };
   }
   ```

3. **构建和测试**
   ```bash
   pnpm build
   pnpm type-check
   ```

### 4. 修改组件

#### 修改 ThemeSwitcher

```typescript
// src/components/ThemeSwitcher.tsx
// 修改组件逻辑或样式
```

#### 修改 ThemeEditor

```typescript
// src/components/ThemeEditor.tsx
// 添加新的编辑功能
```

---

## 🔄 更新和发布流程

### 1. 开发阶段（本地）

```bash
# 1. 修改代码
cd packages/theme-system
# 编辑文件

# 2. 构建
pnpm build

# 3. 类型检查
pnpm type-check

# 4. 在项目中测试
cd ../../apps/km-artizen-ai-ui
pnpm dev
```

### 2. 发布新版本

#### 方式一：发布到 npm（如果发布到公共仓库）

```bash
cd packages/theme-system

# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 构建
pnpm build

# 3. 发布
npm publish
```

#### 方式二：使用 workspace（monorepo 推荐）

在 monorepo 中，直接使用 workspace 协议，无需发布：

```json
// 项目中的 package.json
{
  "dependencies": {
    "@km-design/theme-system": "workspace:*"
  }
}
```

更新步骤：

1. 修改 `packages/theme-system` 中的代码
2. 运行 `pnpm build`
3. 在项目中使用，自动使用最新版本

### 3. 更新项目依赖

#### 如果发布到 npm

```bash
# 在项目目录中
cd apps/km-artizen-ai-ui
pnpm update @km-design/theme-system
```

#### 如果使用 workspace

```bash
# 在项目目录中
cd apps/km-artizen-ai-ui
# 重新安装依赖（确保使用最新版本）
pnpm install
```

---

## 🧪 测试策略

### 1. 单元测试（可选）

```typescript
// src/__tests__/transformer.test.ts
import { transformTheme } from '../transformer';
import defaultTheme from '../presets/default.json';

describe('ThemeTransformer', () => {
  it('should transform theme correctly', () => {
    const result = transformTheme(defaultTheme);
    expect(result.cssVars).toBeDefined();
    expect(result.antd).toBeDefined();
  });
});
```

### 2. 集成测试

在项目中测试：

1. **功能测试**
   - 主题切换功能
   - CSS Variables 应用
   - Ant Design 主题应用

2. **兼容性测试**
   - UmiJS 项目
   - Next.js 项目
   - 不同浏览器

3. **性能测试**
   - 包体积
   - 加载时间
   - 主题切换响应时间

---

## 📝 开发规范

### 1. 代码规范

- 使用 TypeScript
- 遵循项目 ESLint 规则
- 使用 Prettier 格式化

### 2. 提交规范

```bash
# 提交信息格式
type(scope): subject

# 示例
feat(theme): add ocean theme
fix(transformer): fix color scale conversion
docs(readme): update usage examples
```

### 3. 版本管理

使用语义化版本（Semantic Versioning）：

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向后兼容的功能新增
- **PATCH**: 向后兼容的问题修复

### 4. 文档更新

修改功能后，记得更新：

- `README.md` - 使用文档
- `MIGRATION_GUIDE.md` - 迁移指南（如需要）
- 代码注释

---

## 🔧 常见开发场景

### 场景 1: 添加新的 CSS Variable

```typescript
// src/transformer/index.ts
public toCSSVariables(): CSSVariables {
  // ... 现有代码

  // 添加新的变量
  vars['--my-new-var'] = this.config.colors.primary[500];

  return vars;
}
```

### 场景 2: 修改 Ant Design 组件主题

```typescript
// src/transformer/index.ts
public toAntdTheme(): AntDesignTheme {
  return {
    components: {
      Button: {
        // 修改按钮主题
        colorPrimary: this.config.colors.primary[500],
        // ...
      },
      // 添加新组件
      Drawer: {
        colorBgElevated: this.config.colors.semantic.card,
      },
    },
  };
}
```

### 场景 3: 添加新的主题属性

1. **更新类型定义**

   ```typescript
   // src/tokens/types.ts
   export interface ThemeConfig {
     // ... 现有字段
     custom?: {
       // 新属性
     };
   }
   ```

2. **在转换器中使用**

   ```typescript
   // src/transformer/index.ts
   if (this.config.custom) {
     // 使用新属性
   }
   ```

3. **更新主题 JSON**
   ```json
   {
     "custom": {
       // 新配置
     }
   }
   ```

---

## 🚀 快速开发技巧

### 1. 使用 watch 模式

```bash
# 在包目录中
cd packages/theme-system
pnpm dev  # 监听文件变化，自动构建
```

### 2. 使用 TypeScript 类型检查

```bash
# 快速检查类型错误
pnpm type-check
```

### 3. 调试技巧

- 使用 `console.log` 调试转换逻辑
- 在浏览器中检查 CSS Variables
- 使用 React DevTools 检查组件状态

---

## 📚 参考资源

- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Rollup 文档](https://rollupjs.org/)
- [Ant Design 主题定制](https://ant.design/docs/react/customize-theme)
- [Tailwind CSS 配置](https://tailwindcss.com/docs/configuration)

---

## ❓ 常见问题

### Q: 修改后项目没有更新？

**A**: 确保：

1. 运行了 `pnpm build`
2. 项目使用的是 workspace 协议
3. 重启了开发服务器

### Q: 如何添加新的预设主题？

**A**:

1. 在 `src/presets/` 创建 JSON 文件
2. UmiJS 会自动加载
3. Next.js 需要在适配器中注册

### Q: 如何修改主题切换器的样式？

**A**:

1. 修改 `src/components/ThemeSwitcher.tsx`
2. 构建包
3. 在项目中测试

### Q: 如何回滚到之前的版本？

**A**:

- 如果使用 workspace：使用 git 回滚代码
- 如果发布到 npm：安装特定版本 `pnpm add @km-design/theme-system@1.0.0`

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0
