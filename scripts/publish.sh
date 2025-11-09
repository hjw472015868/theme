#!/bin/bash

# 主题包发布脚本
# 使用方法: ./scripts/publish.sh

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 开始发布主题包...${NC}"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ 错误: 请在 packages/theme-system 目录下运行此脚本${NC}"
  exit 1
fi

# 构建包
echo -e "${YELLOW}🔨 构建包...${NC}"
pnpm build

# 检查构建输出
if [ ! -d "dist" ]; then
  echo -e "${RED}❌ 构建失败：dist 目录不存在${NC}"
  exit 1
fi

if [ ! -f "dist/index.js" ] || [ ! -f "dist/index.esm.js" ] || [ ! -f "dist/index.d.ts" ]; then
  echo -e "${RED}❌ 构建失败：缺少必要的构建文件${NC}"
  exit 1
fi

# 检查版本
VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}📦 当前版本: ${VERSION}${NC}"

# 检查是否已登录 npm
if ! npm whoami &> /dev/null; then
  echo -e "${RED}❌ 未登录 npm，请先运行: npm login${NC}"
  exit 1
fi

# 确认发布
echo -e "${YELLOW}⚠️  即将发布到 npm${NC}"
read -p "是否继续? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}❌ 取消发布${NC}"
  exit 1
fi

# 发布
echo -e "${GREEN}🚀 发布到 npm...${NC}"
npm publish --access public

echo -e "${GREEN}✅ 发布成功！${NC}"
echo -e "${GREEN}📦 包地址: https://www.npmjs.com/package/@km-design/theme-system${NC}"
echo -e "${YELLOW}💡 在其他项目中使用: pnpm add @km-design/theme-system@${VERSION}${NC}"

