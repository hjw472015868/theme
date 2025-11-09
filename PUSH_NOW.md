# 立即推送步骤

## 🚀 快速推送

由于需要认证，请手动执行以下命令：

### 步骤 1: 推送代码

```bash
cd packages/theme-system
git push -u origin main
```

**如果提示输入用户名和密码**：
- 用户名：`hjw472015868`
- 密码：使用 GitHub Personal Access Token（不是 GitHub 密码）

### 步骤 2: 推送标签

```bash
git push origin v1.0.0
```

---

## 🔑 创建 Personal Access Token（如果还没有）

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置：
   - Note: `theme-system-push`
   - Expiration: 根据需要选择
   - Scopes: 勾选 `repo`（完整仓库访问权限）
4. 点击 "Generate token"
5. **复制 token**（只显示一次，请保存好）

---

## ✅ 推送后验证

访问：https://github.com/hjw472015868/theme

应该看到：
- ✅ 所有文件已上传
- ✅ 标签 v1.0.0 已创建

---

## 📦 在其他项目中使用

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

**当前状态**: 代码已准备好，等待推送

