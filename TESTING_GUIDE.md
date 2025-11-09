# 测试指南

## ✅ 已完成

### 1. 包构建成功
- ✅ 所有文件已生成
- ✅ 类型定义完整
- ✅ 预设主题已复制

### 2. 包已安装到项目
- ✅ 在 `apps/km-artizen-ai-ui/package.json` 中添加了依赖
- ✅ 使用 `workspace:*` 协议（本地开发）

### 3. 测试页面已创建
- ✅ 创建了 `src/pages/test-theme/index.tsx`
- ✅ 测试页面使用新包，不影响现有功能

---

## 🧪 测试步骤

### 1. 启动开发服务器

```bash
cd apps/km-artizen-ai-ui
pnpm dev
```

### 2. 访问测试页面

在浏览器中访问：
```
http://localhost:8000/test-theme
```

### 3. 验证功能

在测试页面中验证以下功能：

#### ✅ 基础功能
- [ ] 页面正常加载
- [ ] 主题切换器显示正常
- [ ] 可用主题列表显示正确
- [ ] 主题信息显示正确

#### ✅ 主题切换
- [ ] 可以切换到不同主题
- [ ] 切换后样式立即生效
- [ ] CSS Variables 正确应用
- [ ] Ant Design 组件样式正确

#### ✅ CSS Variables
- [ ] `var(--background)` 正确显示
- [ ] `var(--card)` 正确显示
- [ ] `var(--primary)` 正确显示
- [ ] 所有变量都能正常使用

#### ✅ Ant Design 组件
- [ ] 按钮样式正确
- [ ] 卡片样式正确
- [ ] 其他组件样式正确

---

## 🔍 对比测试

### 对比新旧系统

1. **访问现有页面**（使用旧的主题系统）
   - 访问任意现有页面，如首页
   - 检查主题功能是否正常

2. **访问测试页面**（使用新的包）
   - 访问 `/test-theme`
   - 检查功能是否一致

3. **对比结果**
   - 功能是否一致？
   - 样式是否一致？
   - 性能是否有差异？

---

## 📝 测试检查清单

### 功能测试
- [ ] 主题切换功能正常
- [ ] 所有主题都能正常加载
- [ ] CSS Variables 正确应用到 DOM
- [ ] Ant Design 组件样式正确
- [ ] 主题持久化（localStorage）正常

### 兼容性测试
- [ ] 与现有功能无冲突
- [ ] 不影响现有页面
- [ ] 控制台无错误

### 性能测试
- [ ] 页面加载速度正常
- [ ] 主题切换响应时间 < 100ms
- [ ] 无明显的性能问题

---

## 🐛 问题排查

### 如果测试页面无法访问

1. **检查路由配置**
   ```bash
   # UmiJS 会自动识别 src/pages 下的文件
   # 确保文件路径正确：src/pages/test-theme/index.tsx
   ```

2. **检查控制台错误**
   - 打开浏览器开发者工具
   - 查看 Console 标签页
   - 检查是否有错误信息

3. **检查包是否正确安装**
   ```bash
   cd apps/km-artizen-ai-ui
   ls node_modules/@km-design/theme-system
   ```

### 如果主题切换不工作

1. **检查 UmiThemeProvider**
   - 确保测试页面使用了 `UmiThemeProvider`
   - 检查是否有错误信息

2. **检查主题加载**
   - 打开控制台
   - 查看是否有 "已加载预设主题" 的日志

3. **检查 CSS Variables**
   ```javascript
   // 在浏览器控制台执行
   getComputedStyle(document.documentElement).getPropertyValue('--background')
   ```

---

## ✅ 测试通过后

如果所有测试都通过，说明：

1. ✅ 包功能正常
2. ✅ 可以安全使用
3. ✅ 可以开始逐步迁移

**下一步**：
- 参考 `SAFE_MIGRATION_GUIDE.md` 进行渐进式迁移
- 或直接替换 `app.tsx` 中的 ThemeProvider（如果确认无误）

---

## 📞 获取帮助

如果遇到问题：

1. 查看控制台错误信息
2. 检查包是否正确构建
3. 检查依赖是否正确安装
4. 参考 `SAFE_MIGRATION_GUIDE.md` 的排查部分

---

**最后更新**: 2025-01-14  
**状态**: 测试页面已创建，待验证

