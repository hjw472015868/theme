# 快速分享指南

## 🎯 推荐方案：直接复制构建后的包

不需要 npm 账号，直接复制包给其他项目使用！

---

## 🚀 快速步骤

### 1. 构建和打包

```bash
cd packages/theme-system

# 方式一：使用脚本（推荐）
pnpm package

# 方式二：手动打包
pnpm build
mkdir -p publish
cp -r dist presets package.json README.md publish/
```

### 2. 分享给其他项目

**方式 A: 发送压缩包**
- 发送 `theme-system-v1.0.0.zip` 或 `theme-system-v1.0.0.tar.gz` 给其他人
- 或者发送 `publish/` 目录

**方式 B: 直接复制**
- 复制 `publish/theme-system-v1.0.0/` 目录给其他人

### 3. 在其他项目中安装

**步骤 1: 复制到项目**

```bash
cd /path/to/other-project
mkdir -p packages/theme-system
# 复制 publish/theme-system-v1.0.0/* 到 packages/theme-system/
cp -r /path/to/theme-system-v1.0.0/* packages/theme-system/
```

**步骤 2: 在 package.json 中添加**

```json
{
  "dependencies": {
    "@km-design/theme-system": "file:./packages/theme-system"
  }
}
```

**步骤 3: 安装依赖**

```bash
pnpm install
```

**步骤 4: 使用包**

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

### 2. 更新版本号（可选）

```bash
# 手动更新 package.json 中的 version
# 例如：1.0.0 -> 1.0.1
```

### 3. 重新打包

```bash
pnpm package
```

### 4. 分享新版本

- 发送新的压缩包给其他项目
- 或直接复制 `publish/` 目录

### 5. 在其他项目中更新

```bash
# 删除旧版本
rm -rf packages/theme-system

# 复制新版本
cp -r /path/to/new-version/* packages/theme-system/

# 重新安装
pnpm install
```

---

## ✅ 优点

1. ✅ **不需要 npm 账号** - 直接复制即可
2. ✅ **简单直接** - 不需要配置
3. ✅ **完全独立** - 不依赖网络
4. ✅ **适合内部项目** - 适合公司内部使用

---

## 📦 生成的文件

打包后会生成：

- `theme-system-v1.0.0.zip` - 压缩包（zip 格式）
- `theme-system-v1.0.0.tar.gz` - 压缩包（tar.gz 格式）
- `publish/theme-system-v1.0.0/` - 可直接复制的目录

**包含的文件**:
- `dist/` - 构建后的文件
- `presets/` - 预设主题
- `package.json` - 包配置
- `README.md` - 使用说明
- `INSTALL.md` - 安装说明

---

## 💡 使用建议

### 对于内部项目

1. **修改包代码** → `packages/theme-system`
2. **构建和打包** → `pnpm package`
3. **分享压缩包** → 发送给其他项目
4. **其他项目安装** → 解压并添加到 `package.json`

### 对于频繁更新

如果经常更新，可以考虑：
- 使用相对路径（如果项目在同一台机器）
- 使用 Git 仓库（如果有 git 仓库）

---

## 📚 相关文档

- [完整分享指南](./SHARING_GUIDE.md) - 详细的分享方案
- [使用指南](./USAGE_GUIDE.md) - 如何在项目中使用
- [开发指南](./DEVELOPMENT_GUIDE.md) - 如何开发和更新

---

**推荐**: 直接复制构建后的包，简单直接，不需要 npm 账号！

