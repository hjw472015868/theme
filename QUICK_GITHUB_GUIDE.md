# GitHub 快速使用指南

## 🚀 快速步骤

### 1. 创建 GitHub 仓库

1. 访问：https://github.com/new
2. 仓库名称：`theme-system`
3. 选择：Public 或 Private
4. 不要初始化 README、.gitignore、license

### 2. 初始化本地仓库

```bash
cd packages/theme-system

# 初始化 git（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/your-username/theme-system.git
```

### 3. 首次提交

```bash
# 添加文件
git add .

# 提交
git commit -m "Initial commit: theme-system v1.0.0"

# 推送到 GitHub
git push -u origin main
```

### 4. 创建标签和 Release

```bash
# 创建标签
git tag v1.0.0
git push origin v1.0.0

# 在 GitHub 上创建 Release（可选）
# 访问: https://github.com/your-username/theme-system/releases/new
```

### 5. 在其他项目中使用

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/your-username/theme-system.git#v1.0.0"
  }
}
```

然后安装：

```bash
pnpm install
```

---

## 🔄 更新流程

### 1. 修改代码

```bash
cd packages/theme-system
# 编辑文件...
```

### 2. 更新版本号

```bash
# 手动更新 package.json 中的 version
# 例如：1.0.0 -> 1.0.1
```

### 3. 发布新版本

```bash
# 使用脚本（推荐）
pnpm release

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

## ✅ 优点

1. ✅ **版本管理清晰** - 通过 git 标签管理版本
2. ✅ **自动更新** - 可以通过 git 更新
3. ✅ **不需要 npm 账号** - 直接使用 GitHub
4. ✅ **支持私有仓库** - 可以使用私有仓库
5. ✅ **标准方式** - 所有项目都可以使用

---

## 📚 相关文档

- [完整 GitHub 指南](./GITHUB_DEPLOYMENT.md) - 详细的 GitHub 发布指南
- [使用指南](./USAGE_GUIDE.md) - 如何在项目中使用

---

**推荐**: 通过 GitHub 仓库分享包，版本管理清晰，支持自动更新！

