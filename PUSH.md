# 推送到 GitHub

## ✅ 当前状态

- ✅ Git 仓库已初始化
- ✅ 代码已提交（已清理多余文件）
- ✅ 标签已创建（v1.0.0）
- ✅ 远程仓库已配置：`https://github.com/hjw472015868/theme.git`

---

## 🚀 推送步骤

### 方式一：使用 HTTPS + Personal Access Token（推荐）

#### 1. 创建 GitHub Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置：
   - Note: `theme-system-push`
   - Expiration: 根据需要选择
   - Scopes: 勾选 `repo`（完整仓库访问权限）
4. 点击 "Generate token"
5. **复制 token**（只显示一次，请保存好）

#### 2. 推送代码

```bash
cd packages/theme-system

# 推送代码（会提示输入用户名和密码）
# 用户名：hjw472015868
# 密码：使用刚才创建的 Personal Access Token
git push -u origin main
```

#### 3. 推送标签

```bash
git push origin v1.0.0
```

---

### 方式二：使用 GitHub CLI（如果已安装）

```bash
# 登录 GitHub
gh auth login

# 推送代码
cd packages/theme-system
git push -u origin main
git push origin v1.0.0
```

---

## 📝 推送后的验证

### 1. 检查仓库

访问：https://github.com/hjw472015868/theme

应该看到：
- ✅ 所有文件已上传
- ✅ 标签 v1.0.0 已创建

### 2. 创建 Release（可选）

1. 访问：https://github.com/hjw472015868/theme/releases/new
2. 选择标签：`v1.0.0`
3. 标题：`v1.0.0`
4. 描述：添加发布说明
5. 点击 "Publish release"

---

## 🎯 在其他项目中使用

推送成功后，其他项目可以通过以下方式安装：

```json
{
  "dependencies": {
    "@km-design/theme-system": "git+https://github.com/hjw472015868/theme.git#v1.0.0"
  }
}
```

然后安装：

```bash
pnpm install
```

---

## 📦 保留的文件

- ✅ `README.md` - 使用说明
- ✅ `DEVELOPMENT_GUIDE.md` - 开发指南
- ✅ `USAGE_GUIDE.md` - 详细使用指南
- ✅ `QUICK_REFERENCE.md` - 快速参考
- ✅ `src/` - 源代码
- ✅ `dist/` - 构建后的文件
- ✅ `presets/` - 预设主题
- ✅ `scripts/` - 脚本文件

---

**当前状态**: 代码已准备好，等待推送到 GitHub

