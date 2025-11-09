# 发布到 npm 步骤

## ✅ 当前状态

- ✅ 包已构建完成
- ✅ 构建输出正常（`dist/` 目录存在）
- ⚠️ 需要登录 npm

---

## 🚀 发布步骤

### 步骤 1: 登录 npm

```bash
npm login
```

或者如果使用特定的 registry：

```bash
npm login --registry=https://registry.npmjs.org
```

**注意**: 
- 如果没有 npm 账号，需要先注册：https://www.npmjs.com/signup
- 如果使用组织 scope（`@km-design`），需要确保有权限发布

---

### 步骤 2: 验证登录

```bash
npm whoami
```

应该显示你的 npm 用户名。

---

### 步骤 3: 发布包

```bash
cd packages/theme-system

# 方式一：使用脚本（推荐）
pnpm publish:npm

# 方式二：直接发布
npm publish --access public
```

---

### 步骤 4: 验证发布

```bash
npm view @km-design/theme-system
```

应该显示包的详细信息。

---

## 📝 发布前检查清单

- [x] 包已构建（`dist/` 目录存在）
- [x] `package.json` 中的版本号正确（当前：1.0.0）
- [x] `package.json` 中的 `files` 字段包含需要发布的文件
- [x] `package.json` 中的 `publishConfig` 配置正确
- [ ] 已登录 npm
- [ ] 有权限发布到 `@km-design` scope

---

## ⚠️ 注意事项

### 1. Scope 权限

如果使用 `@km-design` scope，需要：
- 确保 npm 账号有权限发布到该 scope
- 或者创建组织并添加自己为成员

### 2. 版本号

当前版本：`1.0.0`

如果需要更新版本：
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 3. 发布后

发布成功后，其他项目可以通过以下方式安装：

```bash
pnpm add @km-design/theme-system
# 或指定版本
pnpm add @km-design/theme-system@1.0.0
```

---

## 🔄 更新流程

### 1. 修改代码

```bash
cd packages/theme-system
# 编辑文件...
```

### 2. 更新版本

```bash
npm version patch  # 自动更新 package.json 中的版本号
```

### 3. 构建和发布

```bash
pnpm build
npm publish --access public
```

---

## 📚 相关文档

- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [npm scope 权限](https://docs.npmjs.com/about-scopes)

---

**当前状态**: 构建完成，等待登录 npm 后发布

