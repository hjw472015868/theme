# AI 主题适配指南

> 基于 `@km-design/theme-system` 的 AI 辅助主题适配标准化指南，确保跨项目一致性和高效适配

## 📋 目录

### 🎯 核心系统

- [背景层级系统](#-背景层级系统)
- [文字颜色层级系统](#-文字颜色层级系统)
- [交互状态统一规范](#-交互状态统一规范)

### 🤖 AI 执行指导

- [AI 识别与适配规则](#-AI识别与适配规则)
- [组件树完整适配策略](#-组件树完整适配策略)
- [标准化执行流程](#-标准化执行流程)

### 🔧 实施规范

- [第三方组件适配策略](#-第三方组件适配策略)
- [适配边界与约束](#-适配边界与约束)
- [项目集成检查清单](#-项目集成检查清单)

---

## 🎯 核心原则

### 设计理念

- **语义化优先**：使用语义化颜色变量而非硬编码色值
- **层级一致性**：确保不同项目使用相同的背景层级系统
- **状态安全性**：防止背景和文字颜色对比度不足的问题
- **边界明确性**：只适配主题系统管控的属性，保留 UI 设计原有架构
- **跨项目通用**：建立标准化规则，AI 可在任何项目中准确适配

### 适配目标

- ✅ 消除所有硬编码主题相关颜色
- ✅ 建立正确的视觉层级关系
- ✅ 确保所有交互状态可见且协调
- ✅ 支持亮色/暗色主题无缝切换
- ✅ 最大限度保持 UI 设计稿完整性

---

## 🏗️ 背景层级系统

### 层级定义与映射

| 层级名称 | CSS 变量 | Tailwind 类 | 语义说明 | 使用场景 | DOM 特征 |
| --- | --- | --- | --- | --- | --- |
| **Page 级** | `--background` | `bg-background` | 页面根背景 | 最外层容器、页面背景、框架布局 | `body`、`main`、`.layout`、`.app`、`.sidebar`、`.header` |
| **Card 级** | `--card` | `bg-card` | 模块容器背景 | 独立面板、弹窗、内容模块 | `.card`、`.panel`、`.modal`、`.content-area` |
| **Muted 级** | `--muted` | `bg-muted` | 信息展示背景 | 表单字段、信息区域 | `.field`、`.info`、`.display`、`input`、`textarea` |
| **Accent 级** | `--accent` | `bg-accent` | 交互反馈背景 | hover 状态、选中行 | `.hover`、`.selected`、`.active`、`:hover` |
| **Primary 级** | `--primary-50/100` | `bg-primary-50/100` | 强调背景 | 重要提示、品牌元素 | `.highlight`、`.brand`、`.important` |

### 严格的层级继承规则

```markdown
✅ **正确的层级递进** Page(background) → Card(card) → Content(muted) → Interaction(accent)

❌ **禁止的层级跳跃**

- Page 直接到 Muted: `background → muted` ❌
- Card 直接到 Accent: `card → accent` ❌ (除非是 hover 状态)
- 跨级回退: `muted → card` ❌ (除非是新的独立容器)

🔄 **特殊状态处理**

- Hover: 当前层级 + hover:bg-accent
- Focus: muted → background (输入框获焦点提升层级)
- Selected: 当前层级 + bg-primary-50 + border-primary
```

---

## 📝 文字颜色层级系统

### 颜色对比安全矩阵

| 背景层级 | 背景变量 | 主要文字 | 次要文字 | 链接/按钮 | Hover 背景 | Hover 文字 |
| --- | --- | --- | --- | --- | --- | --- |
| Page | `bg-background` | `text-foreground` | `text-muted-foreground` | `text-primary` | `hover:bg-accent` | `text-foreground` |
| Card | `bg-card` | `text-foreground` | `text-muted-foreground` | `text-primary` | `hover:bg-accent` | `text-foreground` |
| Muted | `bg-muted` | `text-foreground` | `text-muted-foreground` | `text-primary` | `hover:bg-accent` | `text-foreground` |
| Accent | `bg-accent` | `text-foreground` | `text-muted-foreground` | `text-primary` | `hover:bg-accent/80` | `text-foreground` |
| Primary | `bg-primary-50` | `text-foreground` | `text-muted-foreground` | `text-primary` | `hover:bg-primary-100` | `text-foreground` |

### ⚠️ 关键约束

**任何背景层级的文字颜色都保持一致！**

- 主要文字永远是 `text-foreground`
- 次要文字永远是 `text-muted-foreground`
- 链接/按钮永远是 `text-primary`
- Hover 时文字不变，只变背景

---

## 🎨 第三方组件库适配策略

### 适配原则：最小干预原则

对于第三方组件库（如 Ant Design、Material-UI、Chakra UI 等），应该遵循**最小干预原则**：

```markdown
✅ **必须适配的属性**

- 颜色系统：background-color、color、border-color
- 确保亮色/暗色主题切换正常

🤔 **谨慎适配的属性**

- 圆角：border-radius（保持组件库原有风格）
- 间距：padding、margin（保持组件库内部逻辑）
- 阴影：box-shadow（保持组件库设计语言）

❌ **禁止适配的属性**

- 组件内部布局：flex、grid 等
- 组件特有样式：特殊形状、动画效果
- 交互行为：hover、focus 的非颜色属性
```

### 第三方组件适配边界

| 组件库类型 | 颜色适配 | 尺寸适配 | 圆角适配 | 间距适配 | 推荐策略 |
| --- | --- | --- | --- | --- | --- |
| **UI 组件库** (Ant Design) | ✅ 必须 | ❌ 禁止 | 🤔 谨慎 | ❌ 禁止 | 只适配主题颜色，保持原有设计语言 |
| **无样式组件** (Headless UI) | ✅ 完全适配 | ✅ 完全适配 | ✅ 完全适配 | ✅ 完全适配 | 完全按照项目主题系统 |
| **自定义组件** | ✅ 完全适配 | ✅ 完全适配 | ✅ 完全适配 | ✅ 完全适配 | 严格遵循主题系统 |

### 实际适配示例

```css
/* ✅ 正确的第三方组件适配 - 只控制颜色 */
.ant-btn {
  color: var(--primary-foreground) !important;
  background-color: var(--primary) !important;
  border-color: var(--primary) !important;
  /* 保持原有的 padding、border-radius、font-size */
}

.ant-input {
  color: var(--foreground) !important;
  background-color: var(--muted) !important;
  border-color: var(--border) !important;
  /* 保持 Ant Design 的圆角和间距风格 */
}

/* ❌ 错误的过度适配 */
.ant-btn {
  padding: var(--spacing-sm) var(--spacing-md) !important; /* 破坏了按钮的预设尺寸 */
  font-size: var(--font-size-sm) !important; /* 破坏了组件库的字体层级 */
  background-color: var(--primary) !important;
  border-radius: var(--radius-md) !important; /* 破坏了 Ant Design 的设计语言 */
}
```

### 决策流程

```typescript
function shouldAdaptThirdPartyProperty(
  library: string,
  property: string,
  component: string,
): boolean {
  // 1. 颜色相关属性 - 必须适配
  const colorProperties = [
    'color',
    'background-color',
    'border-color',
    'fill',
    'stroke',
    'box-shadow', // 仅阴影的颜色部分
  ];

  if (colorProperties.includes(property)) {
    return true;
  }

  // 2. 检查是否为无样式组件库
  const headlessLibraries = ['headlessui', 'radix-ui', 'ariakit'];
  if (headlessLibraries.some((lib) => library.includes(lib))) {
    return true; // 无样式组件完全适配
  }

  // 3. 其他属性 - 保持组件库原有风格
  return false;
}
```

---

## 🔒 适配边界与约束

### 主题属性映射表

| 属性类型 | 自定义组件 | 第三方 UI 组件库 | 无样式组件库 | 保持原样 |
| --- | --- | --- | --- | --- |
| **颜色** | ✅ `--background`、`--foreground`、`--primary` 等 | ✅ 必须适配 | ✅ 完全适配 | 特殊业务颜色、渐变效果 |
| **字体** | ✅ `--font-family-sans`、`--font-size-base` 等 | 🤔 谨慎适配 | ✅ 完全适配 | 特殊字体、图标字体 |
| **间距** | ✅ `--spacing-xs`、`--spacing-md` 等 | ❌ 保持原样 | ✅ 完全适配 | 业务特定间距、布局尺寸 |
| **圆角** | ✅ `--radius-sm`、`--radius-md` 等 | ❌ 保持原样 | ✅ 完全适配 | 特殊形状、完全方形设计 |
| **阴影** | ✅ `--shadow-sm`、`--shadow-md` 等 | ❌ 保持原样 | ✅ 完全适配 | 特殊阴影效果 |
| **布局** | ❌ flex、grid、position 等 | **保持不变** | 所有布局属性 |
| **动画** | ❌ transition、animation 等 | **保持不变** | 所有动画效果 |
| **业务样式** | ❌ 特定宽高、特殊效果等 | **保持不变** | 业务逻辑相关样式 |

### AI 适配决策流程

```typescript
function shouldAdaptProperty(property: string, value: string): boolean {
  // 1. 检查是否为主题系统管控的属性
  const themeProperties = [
    'color',
    'background-color',
    'border-color',
    'font-family',
    'font-size',
    'font-weight',
    'padding',
    'margin',
    'gap',
    'border-radius',
    'box-shadow',
  ];

  // 2. 检查是否有对应的主题变量
  const hasThemeVariable = checkThemeVariableExists(property, value);

  // 3. 检查是否为特殊业务样式
  const isBusinessSpecific = checkBusinessSpecific(property, value);

  return themeProperties.includes(property) && hasThemeVariable && !isBusinessSpecific;
}
```

### 保持原样的场景示例

```tsx
// ✅ 正确适配 - 只改主题相关属性
<div className="
  bg-card text-foreground p-md rounded-md     /* 主题属性 - 需要适配 */
  flex items-center justify-between           /* 布局属性 - 保持不变 */
  min-h-[64px] w-full                        /* 业务尺寸 - 保持不变 */
  transform transition-all duration-200       /* 动画效果 - 保持不变 */
  hover:scale-105                            /* 特殊效果 - 保持不变 */
">
  内容
</div>

// ❌ 错误适配 - 过度修改非主题属性
<div className="
  bg-card text-foreground p-md rounded-md     /* 主题属性 ✅ */
  flex items-start justify-start              /* 布局被错误修改 ❌ */
  h-16 w-auto                                /* 尺寸被错误修改 ❌ */
">
  内容
</div>
```

---

---

## 🤖 AI 识别与适配规则

### 快速决策树

````typescript
// AI适配核心决策树
function shouldAdaptElement(element, property, value) {
  // 1. 📍 层级识别
  const level = identifyLevel(element);

  // 2. 🎯 属性检查
  if (isColorProperty(property)) {
    return replaceWithSemanticColor(value, level);
  }

  // 3. 🚨 危险组合检测
  if (isDangerousCombination(property, value)) {
    return applySafeFix(property, value, level);
  }

  // 4. 🔒 边界保护
  if (isBusinessSpecific(property, value)) {
    return value; // 保持不变
  }

  return adaptToTheme(property, value, level);
}
### 层级自动识别规则

| 检查项 | Page级 | Card级 | Muted级 | Accent级 |
|--------|--------|--------|---------|----------|
| **选择器** | `body`, `html`, `#root` | `.card`, `.panel`, `.modal` | `input`, `textarea`, `.field` | `:hover`, `.selected` |
| **关键词** | `layout`, `app`, `sidebar`, `header` | `card`, `panel`, `modal`, `dialog` | `field`, `info`, `content` | `hover`, `selected`, `active` |
| **背景适配** | `bg-background` | `bg-card` | `bg-muted` | `bg-accent` |
| **文字适配** | `text-foreground` | `text-foreground` | `text-foreground` | `text-foreground` |

### 危险模式自动识别与修复

```typescript
// 核心AI识别与修复规则
const DANGER_PATTERNS = {
  // 1. 硬编码颜色背景
  'bg-white': 'bg-card',
  'bg-gray-50': 'bg-muted',
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-accent',

  // 2. 硬编码颜色文字
  'text-gray-500': 'text-muted-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-900': 'text-foreground',
  'text-black': 'text-foreground',

  // 3. 危险hover组合
  'hover:bg-gray-100': 'hover:bg-accent',
  'hover:bg-white': 'hover:bg-accent',
  'hover:bg-gray-50': 'hover:bg-accent',

  // 4. 选中状态修复
  'bg-blue-50': 'bg-primary/10',
  'bg-blue-100': 'bg-primary/20',
  'selected:bg-gray-100': 'selected:bg-primary/15',

  // 5. 边框颜色
  'border-gray-200': 'border-border',
  'border-gray-300': 'border-border',
  'border-black/5': 'border-border',
};

// 正则模式匹配
const REGEX_PATTERNS = [
  [/bg-gray-\d+/, 'bg-muted'],
  [/text-gray-\d+/, 'text-muted-foreground'],
  [/hover:bg-gray-\d+/, 'hover:bg-accent'],
  [/border-gray-\d+/, 'border-border'],
  [/bg-\[#[a-fA-F0-9]+\]/, 'bg-card'], // 十六进制背景
  [/text-\[#[a-fA-F0-9]+\]/, 'text-foreground'], // 十六进制文字
];
````

### Tailwind 类约束规则

```typescript
export const TAILWIND_CONSTRAINTS = {
  // ✅ 推荐使用的类
  ALLOWED_CLASSES: [
    'bg-background',
    'bg-card',
    'bg-muted',
    'bg-accent',
    'bg-primary-50',
    'bg-primary-100',
    'bg-primary-200',
    'text-foreground',
    'text-muted-foreground',
    'text-primary',
    'text-primary-foreground',
    'border-border',
    'border-primary',
    'hover:bg-accent',
    'focus:bg-background',
    'selected:bg-primary-50',
  ],

  // ❌ 禁止使用的类
  FORBIDDEN_CLASSES: [
    'bg-white',
    'bg-gray-50',
    'bg-gray-100',
    'text-gray-700',
    'text-gray-500',
    'text-black',
    'bg-primary/10',
    'text-primary-600',
    'border-primary/20',
    'bg-[#ffffff]',
    'text-[#000000]',
  ],
};
```

---

## 📦 组件树完整适配策略

### 核心问题：子组件适配盲点

**传统错误做法**：

- ❌ 只修复当前文件的硬编码颜色
- ❌ 等发现子组件问题再单独修复
- ❌ 被动式修复，导致重复工作

**正确的组件树适配**：

- ✅ 主动扫描所有引用的子组件
- ✅ 批量修复整个组件树
- ✅ 确保父子组件视觉一致性

### 组件依赖扫描清单

当适配一个组件时，必须检查以下依赖：

```typescript
// 1. 直接引用的组件
import SomeComponent from "./some-component";
import { Button, Modal } from "antd";

// 2. 动态引用的组件
const LazyComponent = lazy(() => import("./lazy-component"));

// 3. 条件渲染的组件
{
  showModal && <Modal />;
}
{
  type === "custom" && <CustomComponent />;
}

// 4. 循环渲染的组件
{
  items.map((item) => <ItemComponent key={item.id} />);
}
```

### 组件适配责任链

| 组件类型       | 适配责任 | 检查方式         | 修复策略       |
| -------------- | -------- | ---------------- | -------------- |
| **父组件**     | 容器样式 | 直接检查当前文件 | 按层级规则适配 |
| **子组件**     | 内容样式 | 递归检查引用文件 | 保持视觉一致   |
| **第三方组件** | 全局覆盖 | 检查 globals.css | 最小干预原则   |
| **条件组件**   | 状态样式 | 检查所有分支     | 统一状态处理   |

### AI 适配执行模板

```markdown
## 组件适配工作流

### Step 1: 组件树扫描

- [ ] 识别所有 import 的组件
- [ ] 检查条件渲染的组件
- [ ] 扫描循环渲染的组件
- [ ] 列出第三方组件使用

### Step 2: 依赖检查

- [ ] 每个子组件是否存在硬编码颜色
- [ ] 父子组件的层级关系是否正确
- [ ] 第三方组件是否需要全局样式覆盖

### Step 3: 批量修复

- [ ] 按照组件层级深度排序
- [ ] 从叶子组件开始修复
- [ ] 确保父子组件视觉统一

### Step 4: 整体验证

- [ ] 所有组件都使用语义化变量
- [ ] 视觉层级关系正确
- [ ] 主题切换效果正常
```

### 避免重复工作的关键规则

1. **一次扫描，批量修复** - 不要单点修复
2. **组件树思维** - 考虑整个渲染树的一致性
3. **主动检查** - 不等问题出现再修复
4. **文档化依赖** - 记录组件间的主题依赖关系

---

## 🎯 交互状态统一规范

### 核心原则：深色主题可见性保障

**典型危险场景**：

- ❌ `hover:bg-gray-100` = 深色模式白色背景
- ❌ `selected:bg-white` = 选中状态不可见
- ❌ `bg-gray-50` + `text-gray-500` = 对比度不足

### 全局 Hover 状态统一规范

#### 1. 完整交互状态层次映射

| 组件类型 | 默认状态 | Hover 状态 | Selected 状态 | Focus 状态 | 文字层次 | 使用场景 |
| --- | --- | --- | --- | --- | --- | --- |
| **Card 容器** | `bg-card` | `hover:bg-accent` | `bg-primary/10` | `focus:bg-accent` | `text-foreground` | 卡片、面板 |
| **List 列表项** | `bg-transparent` | `hover:bg-accent` | `bg-primary/20` | `focus:bg-accent` | `text-foreground` | Table 行、Menu 项 |
| **Button 按钮** | `bg-muted` | `hover:bg-accent` | `bg-primary` | `focus:bg-accent` | `text-foreground` | 次要按钮 |
| **Checkbox 多选** | `bg-card` | `hover:bg-accent` | `bg-primary` | `focus:bg-accent` | `text-primary-foreground` | 复选框、多选项 |
| **Radio 单选** | `bg-card` | `hover:bg-accent` | `bg-primary` | `focus:bg-accent` | `text-primary-foreground` | 单选按钮 |
| **Tag 标签** | `bg-muted` | `hover:bg-accent` | `bg-primary/15` | `focus:bg-accent` | `text-foreground` | 筛选器、标签 |
| **Input 输入** | `bg-background` | `hover:bg-card` | N/A | `focus:bg-card` | `text-foreground` | 表单输入框 |
| **Dropdown 下拉** | `bg-card` | `hover:bg-accent` | `bg-primary/20` | `focus:bg-accent` | `text-foreground` | 下拉选项 |

#### 2. 智能状态层次区分规则

**状态优先级层次** (从高到低)：

1. **Selected** - 选中状态 (最高优先级，需要强调)
2. **Focus** - 焦点状态 (键盘导航重要)
3. **Hover** - 悬停状态 (鼠标交互)
4. **Default** - 默认状态 (基础状态)

**智能组合规则**：

```css
/* ✅ 正确的状态层次组合 */
.interactive-element {
  /* 默认状态 */
  @apply bg-transparent text-foreground;

  /* Hover 状态 - 轻微强调 */
  @apply hover:bg-accent hover:text-foreground;

  /* Focus 状态 - 可访问性重要 */
  @apply focus:bg-accent focus:ring-2 focus:ring-primary;

  /* Selected 状态 - 最强调 */
  &.selected {
    @apply bg-primary/20 text-foreground border-primary;
  }

  /* 组合状态 - 选中+悬停 */
  &.selected:hover {
    @apply bg-primary/30 text-foreground;
  }
}
```

#### 2. 禁用的危险 Hover 组合

```css
/* ❌ 绝对禁止的危险组合 */
.dangerous-hover {
  /* 任何灰色系 hover 背景 */
  hover:bg-gray-50;   /* 深色模式下 = 白色背景 */
  hover:bg-gray-100;  /* 深色模式下 = 白色背景 */
  hover:bg-gray-200;  /* 深色模式下 = 白色背景 */

  /* 白色 hover 背景 */
  hover:bg-white;     /* 深色模式下 = 白色背景 */
  hover:bg-white/80;  /* 深色模式下 = 半透明白色 */

  /* 配合灰色文字的组合 */
  text-gray-500 + hover:bg-gray-100; /* 双重灰色 = 看不清 */
}

/* ✅ 正确的安全组合 */
.safe-hover {
  /* 统一使用语义化变量 */
  hover:bg-accent;           /* 自动适配主题 */
  hover:bg-card;            /* 安全的卡片背景 */
  hover:bg-muted;           /* 安全的静音背景 */

  /* 配合对比安全的文字 */
  text-foreground;          /* 确保对比度 */
  text-muted-foreground;    /* 次要文字安全色 */
}
```

#### 3. 多选和 Table 选中状态特殊处理

**关键问题**：深色主题下选中状态经常出现白色背景+白色文字的问题。

**常见危险场景**：

```css
/* ❌ 危险的选中状态组合 */
.selected {
  color: white;
  background: white;
} /* 深色模式完全不可见 */

.ant-table-row-selected {
  background: #e6f7ff; /* 浅蓝背景在深色主题下变白 */
}

.ant-checkbox-checked {
  color: white; /* 勾选符号白色 */
  background: white; /* 复选框背景白色 */
}
```

**标准解决方案**：

| 场景类型         | 修复前        | 修复后          | 说明                   |
| ---------------- | ------------- | --------------- | ---------------------- |
| **Table 行选中** | `bg-blue-50`  | `bg-primary/20` | 半透明主色，确保对比度 |
| **多选复选框**   | `bg-white`    | `bg-primary`    | 实色主色背景           |
| **下拉选中项**   | `bg-gray-100` | `bg-primary/15` | 轻微主色强调           |
| **标签选中**     | `bg-blue-100` | `bg-primary/20` | 统一主色系             |
| **列表项选中**   | `bg-slate-50` | `bg-primary/10` | 最轻微的选中强调       |

**智能区分逻辑**：

```typescript
// AI应该智能识别并应用以下逻辑
const getSelectionState = (element: string, context: 'multi' | 'single') => {
  if (context === 'multi') {
    // 多选场景 - 需要更强的视觉对比
    return {
      background: 'bg-primary/20',
      text: 'text-foreground',
      border: 'border-primary',
      hover: 'hover:bg-primary/30',
    };
  } else {
    // 单选场景 - 相对温和的强调
    return {
      background: 'bg-primary/10',
      text: 'text-foreground',
      border: 'border-primary/50',
      hover: 'hover:bg-primary/20',
    };
  }
};
```

#### 4. AI 识别模式

AI 在适配时应自动识别并修复以下模式：

```typescript
// Pattern 1: 灰色系 hover 背景
/hover:bg-gray-\d+/ → 'hover:bg-accent'

// Pattern 2: 白色 hover 背景
/hover:bg-white/ → 'hover:bg-accent'

// Pattern 3: 选中状态背景修复
/bg-blue-\d+.*selected/ → 'bg-primary/20 selected'
/bg-slate-\d+.*selected/ → 'bg-primary/15 selected'
/bg-gray-\d+.*selected/ → 'bg-primary/10 selected'

// Pattern 4: 多选复选框状态
/.ant-checkbox-checked.*bg-white/ → 'bg-primary'
/.ant-table-row-selected.*bg-.*\d+/ → 'bg-primary/20'

// Pattern 5: 下拉选中项
/.selected.*bg-gray-/ → 'bg-primary/15'
/.active.*bg-blue-/ → 'bg-primary/20'

// Pattern 3: 危险的文字+背景组合
/(text-gray-\d+).*?(hover:bg-gray-\d+)/ → '$1 hover:bg-accent'
/(text-white).*?(hover:bg-white)/ → 'text-foreground hover:bg-accent'

// Pattern 4: 透明度危险组合
/bg-white\/\d+/ → 'bg-card'
/hover:bg-white\/\d+/ → 'hover:bg-accent'
```

### 第三方组件 Hover 状态适配

#### 1. Ant Design 全局 Hover 覆盖

在 `globals.css` 中添加：

```css
/* Ant Design Hover 状态统一适配 */
.ant-btn:not(.ant-btn-primary):hover,
.ant-menu-item:hover,
.ant-dropdown-menu-item:hover,
.ant-select-item-option:hover,
.ant-table-tbody > tr:hover > td,
.ant-list-item:hover {
  color: var(--foreground) !important;
  background-color: var(--accent) !important;
}

/* Ant Design 输入框 focus 状态 */
.ant-input:focus,
.ant-input-affix-wrapper:focus,
.ant-input-affix-wrapper-focused {
  color: var(--foreground) !important;
  background-color: var(--card) !important;
  border-color: var(--primary) !important;
}
```

#### 2. AI 自动修复工作流

**Hover 状态扫描清单**：

- [ ] 扫描所有 `hover:bg-gray-*` 类
- [ ] 扫描所有 `hover:bg-white*` 类
- [ ] 检查 `text-*` + `hover:bg-*` 组合安全性
- [ ] 验证第三方组件 hover 状态
- [ ] 确认 focus 状态一致性
- [ ] 测试深色主题下的可见性

**自动修复优先级**：

1. **P0 - 完全不可见**：白色背景+白色文字
2. **P1 - 严重对比问题**：灰色背景+灰色文字
3. **P2 - 不一致性**：部分组件未使用统一 hover
4. **P3 - 第三方组件**：需要全局 CSS 覆盖

---

## 🔄 标准化执行流程

### AI 适配执行步骤

```markdown
### Phase 1: 组件树扫描

1. 🔍 **识别组件依赖** - 扫描所有 import 和引用的组件
2. 🎯 **标记适配目标** - 列出需要修复的文件和问题点
3. 📋 **制定修复计划** - 按照父 → 子顺序排列修复优先级

### Phase 2: 危险模式识别

4. � **应用识别规则** - 使用 DANGER_PATTERNS 自动匹配
5. 🔧 **生成修复方案** - 替换危险类为安全的语义化变量
6. 🛡️ **边界保护检查** - 确保不修改业务特定样式

### Phase 3: 批量执行修复

7. ⚡ **批量应用修复** - 一次性修复整个组件树
8. 🎨 **保持视觉一致** - 确保父子组件风格协调
9. 🧪 **语法验证** - 检查 Tailwind 类的有效性

### Phase 4: 质量验证

10. 🌓 **主题切换测试** - 验证亮色/暗色主题效果
11. 🎯 **交互状态检查** - 确保 hover/selected/focus 可见
12. 📊 **对比度验证** - 文字背景对比度符合可访问性标准
```

---

## ✅ 项目集成检查清单

### 必要文件检查

- [ ] `@km-design/theme-system/index.css` 已正确导入
- [ ] `tailwind.config.js` 包含完整主题变量定义
- [ ] 全局 CSS 包含第三方组件适配

### 代码规范检查

- [ ] 无硬编码主题相关颜色
- [ ] 无不存在的 Tailwind 类
- [ ] 层级关系正确（无跨级跳跃）
- [ ] 状态配对安全（无危险颜色组合）
- [ ] **非主题属性完全保持原样**
- [ ] **UI 设计稿架构完整保留**

### 功能验证检查

- [ ] 亮色主题显示正常
- [ ] 暗色主题显示正常
- [ ] 所有交互状态可见且协调
- [ ] **原有布局和动画效果正常**
- [ ] **业务特定样式未被影响**

---

## 🚀 使用方法

### AI 适配执行顺序

1. **读取本指南** - 理解层级系统和边界约束
2. **边界识别** - 区分主题属性和非主题属性
3. **分析组件结构** - 识别 DOM 层级和语义角色
4. **应用层级规则** - 只对主题相关属性进行适配
5. **配对文字颜色** - 使用安全矩阵确保对比度
6. **添加交互状态** - 应用标准状态转换规则
7. **执行安全检查** - 验证语法和边界约束

### 核心原则

- **换肤不重设计**：只改变主题相关属性
- **保留 UI 完整性**：维持原有设计架构
- **确保功能正常**：不影响布局和交互逻辑

---

## 🚀 使用指导

### AI 适配核心原则

1. **语义化优先** - 使用`bg-card`而非`bg-white`
2. **组件树思维** - 批量修复，避免遗漏子组件
3. **安全第一** - 确保深色模式下的可见性
4. **边界清晰** - 只修改主题属性，保留业务逻辑

### 快速上手流程

1. 📖 **阅读指南** - 理解层级系统和危险模式
2. 🔍 **扫描组件树** - 识别所有需要适配的组件
3. 🚨 **应用识别规则** - 使用 DANGER_PATTERNS 自动修复
4. ✅ **验证效果** - 测试主题切换和交互状态

---

**文档版本**: v2.0.0 (优化版)  
**最后更新**: 2025-11-14  
**维护者**: KM Design Team & AI Assistant

> **💡 优化要点**: 此版本删除了冗余内容，整合了 AI 识别规则，增强了实用性和可操作性。
