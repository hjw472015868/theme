# 包分享指南（不发布到 npm）

## 🎯 场景

没有 npm 账号，或者不想发布到 npm，如何分享包给其他项目使用？

---

## 📦 方案对比

### 方案一：直接复制构建后的包（推荐 ⭐⭐⭐⭐⭐）

**优点**:

- ✅ 最简单直接
- ✅ 不需要 npm 账号
- ✅ 不需要网络
- ✅ 完全独立

**缺点**:

- ⚠️ 需要手动复制
- ⚠️ 更新需要重新复制

**适用场景**: 内部项目、少量项目、不需要频繁更新

---

### 方案二：使用相对路径（推荐 ⭐⭐⭐⭐）

**优点**:

- ✅ 自动同步（修改后立即生效）
- ✅ 不需要复制
- ✅ 适合开发阶段

**缺点**:

- ⚠️ 项目必须在同一台机器或共享目录
- ⚠️ 路径需要配置

**适用场景**: 本地开发、同一台机器上的项目

---

### 方案三：使用 Git 仓库（推荐 ⭐⭐⭐⭐）

**优点**:

- ✅ 版本管理清晰
- ✅ 可以通过 git 更新
- ✅ 不需要 npm 账号

**缺点**:

- ⚠️ 需要 git 仓库
- ⚠️ 需要配置

**适用场景**: 有 git 仓库、需要版本管理

---

## 🚀 方案一：直接复制构建后的包（推荐）

### 步骤 1: 构建包

```bash
cd packages/theme-system
pnpm build
```

### 步骤 2: 打包构建后的文件

```bash
# 创建发布目录
mkdir -p publish

# 复制需要的文件
cp -r dist publish/
cp -r presets publish/
cp package.json publish/
cp README.md publish/

# 或者使用 tar 打包
tar -czf theme-system-v1.0.0.tar.gz dist presets package.json README.md
```

### 步骤 3: 分享给其他项目

**方式 A: 直接复制目录**

```bash
# 在目标项目中创建包目录
mkdir -p /path/to/other-project/packages/theme-system

# 复制文件
cp -r publish/* /path/to/other-project/packages/theme-system/
```

**方式 B: 使用压缩包**

```bash
# 发送 theme-system-v1.0.0.tar.gz 给其他人
# 在目标项目中解压
cd /path/to/other-project/packages
tar -xzf theme-system-v1.0.0.tar.gz
mv dist presets package.json README.md theme-system/
```

### 步骤 4: 在项目中使用

在目标项目的 `package.json` 中添加：

```json
{
  "dependencies": {
    "@km-design/theme-system": "file:./packages/theme-system"
  }
}
```

然后安装：

```bash
cd /path/to/other-project
pnpm install
```

### 步骤 5: 使用包

```typescript
import { NextThemeProvider, useTheme } from '@km-design/theme-system';
```

---

## 🔧 方案二：使用相对路径

### 步骤 1: 在项目 package.json 中添加

```json
{
  "dependencies": {
    "@km-design/theme-system": "file:../../brainstorming-css-ux/km-artizen-ui/packages/theme-system"
  }
}
```

**注意**: 路径需要根据项目位置调整。

### 步骤 2: 安装依赖

```bash
cd /path/to/other-project
pnpm install
```

### 步骤 3: 使用包

```typescript
import { NextThemeProvider, useTheme } from '@km-design/theme-system';
```

---

## 📦 方案三：使用 Git 仓库

### 步骤 1: 创建 Git 仓库（如果还没有）

```bash
cd packages/theme-system
git init
git add .
git commit -m "Initial commit"
# 推送到远程仓库
git remote add origin <your-git-repo-url>
git push -u origin main
```

### 步骤 2: 在项目中使用

在目标项目的 `package.json` 中添加：

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/your-username/theme-system.git"
  }
}
```

或者指定分支/标签：

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/your-username/theme-system.git#v1.0.0"
  }
}
```

### 步骤 3: 安装依赖

```bash
cd /path/to/other-project
pnpm install
```

---

## 🎯 推荐方案：直接复制构建后的包

### 自动化脚本

创建 `scripts/package-for-sharing.sh`:

```bash
#!/bin/bash

# 打包脚本 - 用于分享包给其他项目

set -e

VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="theme-system-v${VERSION}"

echo "📦 开始打包..."

# 构建包
echo "🔨 构建包..."
pnpm build

# 创建临时目录
TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="${TEMP_DIR}/${PACKAGE_NAME}"

# 创建包目录
mkdir -p "${PACKAGE_DIR}"

# 复制需要的文件
echo "📋 复制文件..."
cp -r dist "${PACKAGE_DIR}/"
cp -r presets "${PACKAGE_DIR}/"
cp package.json "${PACKAGE_DIR}/"
cp README.md "${PACKAGE_DIR}/"

# 创建使用说明
cat > "${PACKAGE_DIR}/INSTALL.md" << EOF
# 安装说明

## 1. 复制到项目

将此目录复制到你的项目中：

\`\`\`bash
mkdir -p packages/theme-system
cp -r ${PACKAGE_NAME}/* packages/theme-system/
\`\`\`

## 2. 在 package.json 中添加依赖

\`\`\`json
{
  "dependencies": {
    "@km-design/theme-system": "file:./packages/theme-system"
  }
}
\`\`\`

## 3. 安装依赖

\`\`\`bash
pnpm install
\`\`\`

## 4. 使用包

\`\`\`typescript
import { NextThemeProvider, useTheme } from '@km-design/theme-system';
\`\`\`
EOF

# 创建压缩包
echo "📦 创建压缩包..."
cd "${TEMP_DIR}"
tar -czf "${PACKAGE_NAME}.tar.gz" "${PACKAGE_NAME}"
zip -r "${PACKAGE_NAME}.zip" "${PACKAGE_NAME}"

# 复制到当前目录
cp "${PACKAGE_NAME}.tar.gz" .
cp "${PACKAGE_NAME}.zip" .

# 清理临时目录
rm -rf "${TEMP_DIR}"

echo "✅ 打包完成！"
echo "📦 文件:"
echo "   - ${PACKAGE_NAME}.tar.gz"
echo "   - ${PACKAGE_NAME}.zip"
echo ""
echo "💡 分享这些文件给其他项目即可！"
```

---

## 📝 使用流程

### 1. 修改包代码

```bash
cd packages/theme-system
# 编辑文件...
```

### 2. 构建包

```bash
pnpm build
```

### 3. 打包分享

```bash
# 使用脚本（如果创建了）
bash scripts/package-for-sharing.sh

# 或手动打包
mkdir -p publish
cp -r dist presets package.json README.md publish/
tar -czf theme-system-v1.0.0.tar.gz publish/*
```

### 4. 分享给其他项目

- 发送压缩包给其他人
- 或直接复制 `publish/` 目录

### 5. 在其他项目中安装

```bash
# 解压或复制到项目
cd /path/to/other-project
mkdir -p packages/theme-system
# 复制文件...

# 在 package.json 中添加
# "@km-design/theme-system": "file:./packages/theme-system"

# 安装
pnpm install
```

---

## ✅ 推荐方案总结

### 对于内部项目、少量项目

**推荐**: 直接复制构建后的包

**步骤**:

1. 构建包：`pnpm build`
2. 复制 `dist/`、`presets/`、`package.json`、`README.md`
3. 分享给其他项目
4. 在项目中使用 `file:./packages/theme-system`

**优点**:

- ✅ 简单直接
- ✅ 不需要 npm 账号
- ✅ 完全独立

---

## 📚 相关文档

- [使用指南](./USAGE_GUIDE.md) - 如何在项目中使用
- [开发指南](./DEVELOPMENT_GUIDE.md) - 如何开发和更新

---

**推荐**: 直接复制构建后的包，简单直接，不需要 npm 账号！
