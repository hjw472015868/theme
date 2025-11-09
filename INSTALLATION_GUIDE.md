# 安装指南

## 📦 在不同场景下安装主题包

### 场景一：同一 Monorepo 中的项目（推荐）

如果你的项目在同一个 monorepo 中，使用 workspace 协议：

```json
// 你的项目 package.json
{
  "dependencies": {
    "@km-design/theme-system": "workspace:*"
  }
}
```

安装：

```bash
# 在 monorepo 根目录
pnpm install
```

**优点**:
- ✅ 自动使用最新版本
- ✅ 修改包代码后立即生效
- ✅ 无需发布到 npm

---

### 场景二：发布到 npm 后使用

如果包已发布到 npm：

```bash
# 安装包
pnpm add @km-design/theme-system
# 或
npm install @km-design/theme-system
```

**优点**:
- ✅ 版本管理清晰
- ✅ 可以回滚到任意版本
- ✅ 适合生产环境

---

### 场景三：本地开发测试

如果需要在其他项目（不在 monorepo 中）测试：

#### 方法 1: 使用 pnpm link

```bash
# 1. 在主题包目录中创建链接
cd /Users/yylq/Desktop/brainstorming-css-ux/km-artizen-ui/packages/theme-system
pnpm link --global

# 2. 在你的项目中链接
cd /path/to/your/project
pnpm link --global @km-design/theme-system
```

#### 方法 2: 使用相对路径（临时）

```json
// 你的项目 package.json
{
  "dependencies": {
    "@km-design/theme-system": "file:../../brainstorming-css-ux/km-artizen-ui/packages/theme-system"
  }
}
```

#### 方法 3: 使用 pnpm workspace（推荐）

如果你的项目可以添加到 monorepo：

1. 在 `pnpm-workspace.yaml` 中添加你的项目路径
2. 使用 `workspace:*` 协议

---

## 🔧 安装后配置

### 1. 确保包已正确安装

```bash
# 检查包是否存在
ls node_modules/@km-design/theme-system

# 应该看到：
# - dist/
# - presets/
# - package.json
```

### 2. 检查类型定义

```bash
# 检查类型文件
ls node_modules/@km-design/theme-system/dist/*.d.ts
```

### 3. 验证导入

```typescript
// 测试导入
import { UmiThemeProvider } from '@km-design/theme-system';
// 如果没有错误，说明安装成功
```

---

## ⚠️ 依赖要求

### Peer Dependencies

包需要以下 peer dependencies：

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "antd": "^5.0.0"
}
```

确保你的项目已安装这些依赖：

```bash
# 检查依赖
pnpm list react react-dom antd
```

如果没有安装，需要先安装：

```bash
pnpm add react react-dom antd
```

---

## 🐛 安装问题排查

### 问题 1: 找不到包

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

### 问题 2: 类型错误

**症状**: TypeScript 报类型错误

**解决方案**:
1. 检查类型文件是否存在：
   ```bash
   ls node_modules/@km-design/theme-system/dist/index.d.ts
   ```
2. 重启 TypeScript 服务器（VS Code: Cmd+Shift+P -> "TypeScript: Restart TS Server"）

### 问题 3: 构建错误

**症状**: 构建时出错

**解决方案**:
1. 确保包已构建：
   ```bash
   cd packages/theme-system
   pnpm build
   ```
2. 检查构建输出：
   ```bash
   ls packages/theme-system/dist
   ```

---

## 📝 安装检查清单

安装完成后，检查以下项：

- [ ] 包已添加到 `package.json` 的 `dependencies`
- [ ] `node_modules/@km-design/theme-system` 目录存在
- [ ] `dist/` 目录存在且包含构建文件
- [ ] `presets/` 目录存在且包含主题文件
- [ ] 可以正常导入：`import { UmiThemeProvider } from '@km-design/theme-system'`
- [ ] TypeScript 类型检查通过
- [ ] 没有控制台错误

---

## 🎯 下一步

安装完成后，参考：

- [使用指南](./USAGE_GUIDE.md) - 如何在项目中使用
- [README.md](./README.md) - 快速开始

---

**最后更新**: 2025-01-14  
**版本**: v1.0.0

