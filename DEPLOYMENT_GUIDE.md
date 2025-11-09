# 主题包部署和使用指南

## 🎯 问题

对于不在同一个 monorepo 中的独立项目，如何方便地使用主题包？

---

## 📦 方案对比

### 方案一：发布到 npm（推荐 ⭐⭐⭐⭐⭐）

**优点**:
- ✅ 最标准的方式
- ✅ 版本管理清晰
- ✅ 所有项目都可以通过 `pnpm add` 安装
- ✅ 支持语义化版本控制
- ✅ 可以回滚到任意版本

**缺点**:
- ⚠️ 需要 npm 账号
- ⚠️ 需要发布流程

**适用场景**: 生产环境、多个独立项目

---

### 方案二：使用本地 npm registry（推荐 ⭐⭐⭐⭐）

**优点**:
- ✅ 不需要发布到公共 npm
- ✅ 版本管理清晰
- ✅ 所有项目都可以通过 `pnpm add` 安装
- ✅ 私有化部署

**缺点**:
- ⚠️ 需要搭建本地 registry（如 Verdaccio）

**适用场景**: 公司内部、私有项目

---

### 方案三：使用相对路径（临时方案 ⭐⭐⭐）

**优点**:
- ✅ 简单快速
- ✅ 不需要额外配置

**缺点**:
- ❌ 每个项目都需要配置相对路径
- ❌ 路径可能不同，需要修改
- ❌ 不够优雅

**适用场景**: 临时使用、开发测试

---

### 方案四：复制构建后的包（不推荐 ⭐⭐）

**优点**:
- ✅ 不需要网络
- ✅ 完全独立

**缺点**:
- ❌ 需要手动复制
- ❌ 更新麻烦
- ❌ 容易版本不一致

**适用场景**: 特殊情况

---

## 🚀 推荐方案：发布到 npm

### 步骤 1: 准备发布

#### 1.1 检查 package.json

确保包信息正确：

```json
{
  "name": "@km-design/theme-system",
  "version": "1.0.0",
  "description": "统一主题系统，支持 UmiJS 和 Next.js",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "presets",
    "README.md"
  ],
  "publishConfig": {
    "access": "public"
  }
}
```

#### 1.2 构建包

```bash
cd packages/theme-system
pnpm build
```

#### 1.3 检查构建输出

```bash
ls -la dist/
# 应该看到：
# - index.js (CommonJS)
# - index.esm.js (ES Module)
# - index.d.ts (类型定义)
# - index.css (样式文件)
```

---

### 步骤 2: 发布到 npm

#### 2.1 登录 npm

```bash
npm login
# 或
npm login --registry=https://registry.npmjs.org
```

#### 2.2 发布包

```bash
cd packages/theme-system
npm publish
# 或发布到特定 scope
npm publish --access public
```

#### 2.3 验证发布

```bash
npm view @km-design/theme-system
```

---

### 步骤 3: 在其他项目中使用

#### 3.1 安装包

```bash
cd /path/to/your/project
pnpm add @km-design/theme-system
# 或
npm install @km-design/theme-system
```

#### 3.2 使用包

```typescript
import { NextThemeProvider, useTheme } from '@km-design/theme-system';
```

---

## 🔧 方案二：使用相对路径（临时方案）

### 步骤 1: 在项目 package.json 中添加依赖

```json
{
  "dependencies": {
    "@km-design/theme-system": "file:../../brainstorming-css-ux/km-artizen-ui/packages/theme-system"
  }
}
```

### 步骤 2: 安装依赖

```bash
pnpm install
```

### 步骤 3: 使用包

```typescript
import { NextThemeProvider, useTheme } from '@km-design/theme-system';
```

**注意**: 相对路径需要根据项目位置调整。

---

## 📋 方案三：复制构建后的包（不推荐）

### 步骤 1: 构建包

```bash
cd packages/theme-system
pnpm build
```

### 步骤 2: 复制到项目

```bash
# 创建项目本地包目录
mkdir -p /path/to/your/project/packages/theme-system

# 复制构建后的文件
cp -r dist /path/to/your/project/packages/theme-system/
cp -r presets /path/to/your/project/packages/theme-system/
cp package.json /path/to/your/project/packages/theme-system/
cp README.md /path/to/your/project/packages/theme-system/
```

### 步骤 3: 在项目中使用

```json
{
  "dependencies": {
    "@km-design/theme-system": "file:./packages/theme-system"
  }
}
```

**缺点**: 
- 需要手动复制
- 更新麻烦
- 容易版本不一致

---

## 🎯 最佳实践建议

### 对于独立项目

1. **发布到 npm**（推荐）
   - 一次发布，所有项目都可以使用
   - 版本管理清晰
   - 支持语义化版本控制

2. **使用本地 npm registry**（如果不想发布到公共 npm）
   - 搭建 Verdaccio 等私有 registry
   - 公司内部使用

3. **使用相对路径**（临时方案）
   - 仅用于开发测试
   - 不适合生产环境

### 对于 monorepo 项目

- 使用 `workspace:*` 协议
- 自动使用最新版本

---

## 📝 发布脚本

### 自动化发布脚本

创建 `packages/theme-system/scripts/publish.sh`:

```bash
#!/bin/bash

# 构建包
echo "🔨 构建包..."
pnpm build

# 检查构建输出
if [ ! -d "dist" ]; then
  echo "❌ 构建失败：dist 目录不存在"
  exit 1
fi

# 检查版本
VERSION=$(node -p "require('./package.json').version")
echo "📦 当前版本: $VERSION"

# 确认发布
read -p "是否发布到 npm? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 取消发布"
  exit 1
fi

# 发布
echo "🚀 发布到 npm..."
npm publish --access public

echo "✅ 发布成功！"
```

使用：

```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

---

## 🔄 更新流程

### 1. 修改包代码

```bash
cd packages/theme-system
# 编辑文件...
```

### 2. 更新版本

```bash
# 手动更新 package.json 中的 version
# 或使用 npm version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 3. 构建和发布

```bash
pnpm build
npm publish --access public
```

### 4. 在项目中使用新版本

```bash
cd /path/to/your/project
pnpm update @km-design/theme-system
# 或指定版本
pnpm add @km-design/theme-system@1.0.1
```

---

## 📚 相关文档

- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [语义化版本控制](https://semver.org/)
- [Verdaccio 私有 registry](https://verdaccio.org/)

---

**最后更新**: 2025-01-14  
**推荐方案**: 发布到 npm

