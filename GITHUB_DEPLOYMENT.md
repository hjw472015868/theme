# GitHub 发布和使用指南

## 🎯 方案：通过 GitHub 仓库分享包

使用 GitHub 仓库发布包，其他项目可以通过 `git+https://github.com/...` 安装！

---

## 🚀 快速步骤

### 1. 创建 GitHub 仓库

#### 1.1 在 GitHub 上创建仓库

1. 访问：https://github.com/new
2. 仓库名称：`theme-system`（或 `@km-design/theme-system`）
3. 选择：Public 或 Private
4. 不要初始化 README、.gitignore、license（如果已有代码）

#### 1.2 初始化本地仓库

```bash
cd packages/theme-system

# 初始化 git（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/your-username/theme-system.git
# 或使用 SSH
git remote add origin git@github.com:your-username/theme-system.git
```

---

### 2. 准备发布文件

#### 2.1 创建 .gitignore

```bash
cat > .gitignore << EOF
# 依赖
node_modules/
.pnpm-store/

# 构建输出（可选，如果发布构建后的文件）
# dist/

# 临时文件
*.log
.DS_Store
*.swp
*.swo

# IDE
.vscode/
.idea/
*.iml

# 测试
coverage/
.nyc_output/
EOF
```

#### 2.2 提交代码

```bash
# 添加文件
git add .

# 提交
git commit -m "Initial commit: theme-system v1.0.0"

# 推送到 GitHub
git push -u origin main
# 或
git push -u origin master
```

---

### 3. 创建 Release（推荐）

#### 3.1 创建标签

```bash
# 创建标签
git tag v1.0.0

# 推送标签
git push origin v1.0.0
```

#### 3.2 在 GitHub 上创建 Release

1. 访问：`https://github.com/your-username/theme-system/releases/new`
2. 选择标签：`v1.0.0`
3. 标题：`v1.0.0`
4. 描述：添加发布说明
5. 点击 "Publish release"

---

### 4. 在其他项目中使用

#### 4.1 在 package.json 中添加依赖

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/your-username/theme-system.git#v1.0.0"
  }
}
```

**或使用 SSH**:

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+ssh://git@github.com/your-username/theme-system.git#v1.0.0"
  }
}
```

**或使用最新版本**:

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/your-username/theme-system.git"
  }
}
```

#### 4.2 安装依赖

```bash
cd /path/to/other-project
pnpm install
```

#### 4.3 使用包

```typescript
// UmiJS 项目
import { UmiThemeProvider } from '@km-design/theme-system';

// Next.js 项目
import { NextThemeProvider } from '@km-design/theme-system';
```

---

## 📝 更新流程

### 1. 修改包代码

```bash
cd packages/theme-system
# 编辑文件...
```

### 2. 更新版本号

```bash
# 手动更新 package.json 中的 version
# 例如：1.0.0 -> 1.0.1
```

### 3. 提交和推送

```bash
git add .
git commit -m "Update: version 1.0.1"
git push
```

### 4. 创建新标签和 Release

```bash
# 创建新标签
git tag v1.0.1
git push origin v1.0.1

# 在 GitHub 上创建 Release（可选）
```

### 5. 在其他项目中更新

```bash
cd /path/to/other-project

# 方式一：更新到最新版本
pnpm update @km-design/theme-system

# 方式二：指定新版本
pnpm add @km-design/theme-system@git+https://github.com/your-username/theme-system.git#v1.0.1
```

---

## 🎯 推荐配置

### 1. 发布构建后的文件（推荐）

如果发布构建后的文件，需要：

#### 1.1 构建包

```bash
pnpm build
```

#### 1.2 提交构建文件

```bash
git add dist presets
git commit -m "Build: v1.0.0"
git push
```

#### 1.3 更新 .gitignore

```gitignore
# 不忽略 dist 和 presets（如果发布构建后的文件）
# dist/
# presets/
```

**优点**:

- ✅ 其他项目不需要构建
- ✅ 直接使用构建后的文件
- ✅ 安装更快

**缺点**:

- ⚠️ 需要提交构建文件
- ⚠️ 仓库体积较大

---

### 2. 只发布源代码（不推荐）

如果只发布源代码，需要：

#### 2.1 更新 .gitignore

```gitignore
# 忽略构建文件
dist/
```

#### 2.2 其他项目需要构建

其他项目安装后需要：

```bash
cd node_modules/@km-design/theme-system
pnpm install
pnpm build
```

**缺点**:

- ❌ 其他项目需要构建
- ❌ 安装较慢
- ❌ 需要安装构建依赖

---

## 📦 推荐方案：发布构建后的文件

### 1. 构建脚本

创建 `scripts/prepare-release.sh`:

```bash
#!/bin/bash

# 准备发布脚本

set -e

echo "🔨 构建包..."
pnpm build

echo "📦 准备发布文件..."
# 确保 dist 和 presets 已提交
git add dist presets

echo "✅ 准备完成！"
echo "💡 现在可以提交和推送："
echo "   git commit -m 'Build: v1.0.0'"
echo "   git push"
echo "   git tag v1.0.0"
echo "   git push origin v1.0.0"
```

### 2. 使用流程

```bash
# 1. 修改代码
# 编辑文件...

# 2. 更新版本号
# 手动更新 package.json 中的 version

# 3. 构建和准备发布
bash scripts/prepare-release.sh

# 4. 提交
git add .
git commit -m "Release: v1.0.1"
git push

# 5. 创建标签
git tag v1.0.1
git push origin v1.0.1
```

---

## 🔧 自动化脚本

### 创建发布脚本

创建 `scripts/release.sh`:

```bash
#!/bin/bash

# GitHub 发布脚本

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo "❌ 错误: 请在 packages/theme-system 目录下运行此脚本"
  exit 1
fi

# 获取版本号
VERSION=$(node -p "require('./package.json').version")

echo -e "${GREEN}🚀 开始发布 v${VERSION}...${NC}"

# 构建包
echo -e "${YELLOW}🔨 构建包...${NC}"
pnpm build

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}📝 发现未提交的更改，请先提交${NC}"
  git status
  read -p "是否继续? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# 添加构建文件
git add dist presets

# 提交
echo -e "${YELLOW}📝 提交更改...${NC}"
git commit -m "Build: v${VERSION}" || echo "没有更改需要提交"

# 创建标签
echo -e "${YELLOW}🏷️  创建标签 v${VERSION}...${NC}"
git tag -f "v${VERSION}"

# 推送
echo -e "${YELLOW}📤 推送到 GitHub...${NC}"
git push
git push origin "v${VERSION}" --force

echo -e "${GREEN}✅ 发布完成！${NC}"
echo ""
echo -e "${GREEN}📦 在其他项目中使用:${NC}"
echo -e "${YELLOW}   \"@km-design/theme-system\": \"git+https://github.com/your-username/theme-system.git#v${VERSION}\"${NC}"
```

---

## 📚 使用示例

### 在其他项目中安装

```bash
# 在 package.json 中添加
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/your-username/theme-system.git#v1.0.0"
  }
}

# 安装
pnpm install

# 使用
import { NextThemeProvider } from '@km-design/theme-system';
```

---

## ✅ 优点

1. ✅ **版本管理清晰** - 通过 git 标签管理版本
2. ✅ **自动更新** - 可以通过 git 更新
3. ✅ **不需要 npm 账号** - 直接使用 GitHub
4. ✅ **支持私有仓库** - 可以使用私有仓库
5. ✅ **标准方式** - 所有项目都可以使用

---

## 📝 注意事项

### 1. 仓库权限

- **Public 仓库**: 所有人都可以访问
- **Private 仓库**: 需要 GitHub 访问权限

### 2. 安装速度

- 首次安装会克隆整个仓库（较慢）
- 后续更新会使用 git fetch（较快）

### 3. 版本管理

- 使用 git 标签管理版本
- 推荐使用语义化版本（如 v1.0.0）

---

## 🔄 更新流程总结

### 1. 修改代码

```bash
cd packages/theme-system
# 编辑文件...
```

### 2. 更新版本号

```bash
# 手动更新 package.json 中的 version
```

### 3. 构建和发布

```bash
# 使用脚本（如果创建了）
bash scripts/release.sh

# 或手动
pnpm build
git add dist presets
git commit -m "Build: v1.0.1"
git push
git tag v1.0.1
git push origin v1.0.1
```

### 4. 在其他项目中更新

```bash
cd /path/to/other-project
pnpm update @km-design/theme-system
# 或指定版本
pnpm add @km-design/theme-system@git+https://github.com/your-username/theme-system.git#v1.0.1
```

---

## 📚 相关文档

- [使用指南](./USAGE_GUIDE.md) - 如何在项目中使用
- [开发指南](./DEVELOPMENT_GUIDE.md) - 如何开发和更新

---

**推荐**: 通过 GitHub 仓库分享包，版本管理清晰，支持自动更新！
