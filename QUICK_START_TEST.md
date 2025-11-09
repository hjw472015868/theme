# 快速启动测试指南

## 🚀 启动项目并测试

### 步骤 1: 启动开发服务器

```bash
# 进入项目目录
cd apps/km-artizen-ai-ui

# 启动开发服务器
pnpm dev
```

或者从根目录启动：

```bash
# 从根目录启动（会自动识别 workspace）
cd /Users/yylq/Desktop/brainstorming-css-ux/km-artizen-ui
pnpm --filter km-artizen-ai-ui dev
```

### 步骤 2: 等待服务器启动

启动成功后，你会看到类似输出：

```
✔ Webpack
  Compiled successfully in 5.23s

  App running at:
  - Local:   http://localhost:8000/
  - Network: http://192.168.x.x:8000/
```

### 步骤 3: 访问测试页面

在浏览器中打开：

```
http://localhost:8000/test-theme
```

或者如果配置了路由前缀：

```
http://localhost:8000/#/test-theme
```

---

## ✅ 验证清单

### 1. 页面加载验证

- [ ] 测试页面能正常打开
- [ ] 没有白屏或错误页面
- [ ] 控制台没有红色错误

### 2. 主题切换器验证

- [ ] 看到"主题切换器"卡片
- [ ] 显示当前主题名称
- [ ] ThemeSwitcher 组件正常显示
- [ ] 可以点击切换主题

### 3. 可用主题列表验证

- [ ] 看到"可用主题列表"卡片
- [ ] 显示所有可用主题按钮
- [ ] 当前主题按钮高亮显示
- [ ] 点击其他主题按钮可以切换

### 4. 主题信息验证

- [ ] 看到"当前主题信息"卡片
- [ ] 显示主题名称、模式、类型
- [ ] 显示主色调值
- [ ] 信息正确显示

### 5. CSS Variables 验证

- [ ] 看到"CSS Variables 测试"卡片
- [ ] 背景色块正确显示（使用 `var(--background)`）
- [ ] 卡片背景色块正确显示（使用 `var(--card)`）
- [ ] 主色调色块正确显示（使用 `var(--primary)`）
- [ ] 颜色随主题切换而变化

### 6. Ant Design 组件验证

- [ ] 看到"Ant Design 组件测试"卡片
- [ ] 按钮样式正确
- [ ] 按钮颜色随主题变化
- [ ] 其他组件样式正确

### 7. 功能验证清单

- [ ] ✅ 主题转换器工作正常
- [ ] ✅ 主题加载正常（显示已加载的主题数量）
- [ ] ✅ 主题配置读取正常
- [ ] ✅ CSS Variables 应用正常

---

## 🔍 详细验证步骤

### 验证主题切换

1. **点击主题切换器**
   - 点击 ThemeSwitcher 下拉菜单
   - 选择不同的主题
   - 观察页面样式是否立即变化

2. **点击主题按钮**
   - 在"可用主题列表"中点击不同主题按钮
   - 观察按钮高亮状态
   - 观察页面样式变化

3. **验证样式变化**
   - 背景色是否变化
   - 文字颜色是否变化
   - 按钮颜色是否变化
   - 卡片样式是否变化

### 验证 CSS Variables

在浏览器控制台执行：

```javascript
// 检查 CSS Variables 是否正确应用
getComputedStyle(document.documentElement).getPropertyValue('--background');
getComputedStyle(document.documentElement).getPropertyValue('--primary');
getComputedStyle(document.documentElement).getPropertyValue('--card');
```

应该返回颜色值，例如：

- `--background`: `#ffffff` 或 `#1a1a1a`
- `--primary`: `#1890ff` 或其他主题色
- `--card`: `#ffffff` 或 `#2a2a2a`

### 验证主题持久化

1. **切换主题**
   - 选择一个主题（如 `dark`）

2. **刷新页面**
   - 按 F5 或 Cmd+R 刷新页面

3. **验证是否保持**
   - 页面刷新后，主题应该保持为 `dark`
   - 检查 localStorage：
     ```javascript
     localStorage.getItem('km-theme');
     ```
     应该返回 `dark`

---

## 🐛 常见问题排查

### 问题 1: 页面无法访问

**症状**: 访问 `/test-theme` 显示 404

**解决方案**:

1. 检查文件是否存在：
   ```bash
   ls apps/km-artizen-ai-ui/src/pages/test-theme/index.tsx
   ```
2. 检查路由配置（UmiJS 会自动识别 `src/pages` 下的文件）
3. 重启开发服务器

### 问题 2: 主题切换不工作

**症状**: 点击切换主题，样式没有变化

**解决方案**:

1. 打开浏览器控制台，查看是否有错误
2. 检查主题是否加载：
   ```javascript
   // 在控制台执行
   console.log('检查主题加载');
   ```
3. 检查 CSS Variables：
   ```javascript
   getComputedStyle(document.documentElement).getPropertyValue('--background');
   ```

### 问题 3: 控制台有错误

**症状**: 浏览器控制台显示红色错误

**可能原因**:

1. 包未正确安装
2. 导入路径错误
3. 类型错误

**解决方案**:

1. 检查包是否正确安装：
   ```bash
   ls node_modules/@km-design/theme-system
   ```
2. 重新安装依赖：
   ```bash
   pnpm install
   ```
3. 重新构建包：
   ```bash
   cd packages/theme-system
   pnpm build
   ```

### 问题 4: 样式不正确

**症状**: 页面样式显示异常

**解决方案**:

1. 检查 CSS 文件是否加载：
   ```bash
   # 检查构建输出
   ls packages/theme-system/dist/index.css
   ```
2. 检查浏览器 Network 标签，查看 CSS 文件是否加载
3. 检查 CSS Variables 是否正确应用

---

## 📊 对比测试

### 测试新旧系统一致性

1. **访问现有页面**（使用旧的主题系统）

   ```
   http://localhost:8000/
   ```

   - 检查主题切换功能
   - 检查样式显示

2. **访问测试页面**（使用新的包）

   ```
   http://localhost:8000/test-theme
   ```

   - 检查主题切换功能
   - 检查样式显示

3. **对比结果**
   - 功能是否一致？
   - 样式是否一致？
   - 性能是否有差异？

---

## ✅ 测试通过标准

如果以下所有项都通过，说明包可以正常使用：

- [x] 测试页面正常加载
- [x] 主题切换功能正常
- [x] 所有主题都能正常加载
- [x] CSS Variables 正确应用
- [x] Ant Design 组件样式正确
- [x] 主题持久化正常
- [x] 控制台无错误
- [x] 与现有功能无冲突

---

## 🎯 测试通过后

如果所有测试都通过，你可以：

1. **继续使用测试页面**（不影响现有功能）
2. **开始渐进式迁移**（参考 `SAFE_MIGRATION_GUIDE.md`）
3. **完全切换**（如果确认无误）

---

## 📝 测试记录模板

```
测试日期: 2025-01-14
测试人员: [你的名字]

功能测试:
- [ ] 主题切换功能
- [ ] CSS Variables 应用
- [ ] Ant Design 组件样式
- [ ] 主题持久化

兼容性测试:
- [ ] 与现有功能无冲突
- [ ] 不影响现有页面
- [ ] 控制台无错误

性能测试:
- [ ] 页面加载速度正常
- [ ] 主题切换响应时间 < 100ms

结论: [通过/不通过]
备注: [任何问题或建议]
```

---

**最后更新**: 2025-01-14  
**状态**: 测试指南已创建
