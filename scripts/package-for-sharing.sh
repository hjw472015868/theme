#!/bin/bash

# 打包脚本 - 用于分享包给其他项目
# 使用方法: bash scripts/package-for-sharing.sh

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ 错误: 请在 packages/theme-system 目录下运行此脚本${NC}"
  exit 1
fi

# 获取版本号
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="theme-system-v${VERSION}"

echo -e "${GREEN}📦 开始打包主题包...${NC}"
echo -e "${YELLOW}📌 版本: ${VERSION}${NC}"

# 构建包
echo -e "${YELLOW}🔨 构建包...${NC}"
pnpm build

# 检查构建输出
if [ ! -d "dist" ]; then
  echo -e "${RED}❌ 构建失败：dist 目录不存在${NC}"
  exit 1
fi

# 创建临时目录
TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="${TEMP_DIR}/${PACKAGE_NAME}"

# 创建包目录
mkdir -p "${PACKAGE_DIR}"

# 复制需要的文件
echo -e "${YELLOW}📋 复制文件...${NC}"
cp -r dist "${PACKAGE_DIR}/"
cp -r presets "${PACKAGE_DIR}/"
cp package.json "${PACKAGE_DIR}/"
cp README.md "${PACKAGE_DIR}/" 2>/dev/null || echo "⚠️  README.md 不存在，跳过"

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

### UmiJS 项目

\`\`\`typescript
// app.tsx
import { UmiThemeProvider } from '@km-design/theme-system';

export function rootContainer(container: React.ReactElement) {
  return (
    <UmiThemeProvider defaultTheme="km-base">
      {container}
    </UmiThemeProvider>
  );
}
\`\`\`

### Next.js 项目

\`\`\`typescript
// app/layout.tsx
'use client';
import { NextThemeProvider } from '@km-design/theme-system';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextThemeProvider defaultTheme="light">
          {children}
        </NextThemeProvider>
      </body>
    </html>
  );
}
\`\`\`

## 5. 更多文档

查看 README.md 获取更多使用说明。
EOF

# 创建压缩包
echo -e "${YELLOW}📦 创建压缩包...${NC}"
cd "${TEMP_DIR}"
tar -czf "${PACKAGE_NAME}.tar.gz" "${PACKAGE_NAME}" 2>/dev/null || echo "⚠️  tar 命令失败，跳过 .tar.gz"
zip -r "${PACKAGE_NAME}.zip" "${PACKAGE_NAME}" 2>/dev/null || echo "⚠️  zip 命令失败，跳过 .zip"

# 复制到当前目录
if [ -f "${PACKAGE_NAME}.tar.gz" ]; then
  cp "${PACKAGE_NAME}.tar.gz" "$(pwd)/"
fi
if [ -f "${PACKAGE_NAME}.zip" ]; then
  cp "${PACKAGE_NAME}.zip" "$(pwd)/"
fi

# 复制目录到当前目录（作为备选）
cp -r "${PACKAGE_NAME}" "$(pwd)/publish"

# 清理临时目录
rm -rf "${TEMP_DIR}"

echo -e "${GREEN}✅ 打包完成！${NC}"
echo ""
echo -e "${GREEN}📦 生成的文件:${NC}"
if [ -f "${PACKAGE_NAME}.tar.gz" ]; then
  echo -e "   - ${GREEN}${PACKAGE_NAME}.tar.gz${NC}"
fi
if [ -f "${PACKAGE_NAME}.zip" ]; then
  echo -e "   - ${GREEN}${PACKAGE_NAME}.zip${NC}"
fi
echo -e "   - ${GREEN}publish/${PACKAGE_NAME}/${NC} (可直接复制)"
echo ""
echo -e "${YELLOW}💡 分享这些文件给其他项目即可！${NC}"
echo -e "${YELLOW}💡 其他项目解压后，在 package.json 中添加:${NC}"
echo -e "${YELLOW}   \"@km-design/theme-system\": \"file:./packages/theme-system\"${NC}"

