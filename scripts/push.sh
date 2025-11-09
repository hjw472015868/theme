#!/bin/bash

# 推送到 GitHub 脚本
# 使用方法: bash scripts/push.sh

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 开始推送到 GitHub...${NC}"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo "❌ 错误: 请在 packages/theme-system 目录下运行此脚本"
  exit 1
fi

# 检查远程仓库
if ! git remote get-url origin &> /dev/null; then
  echo "❌ 错误: 未配置远程仓库"
  exit 1
fi

REMOTE_URL=$(git remote get-url origin)
echo -e "${YELLOW}📦 远程仓库: ${REMOTE_URL}${NC}"

# 推送代码
echo -e "${YELLOW}📤 推送代码到 main 分支...${NC}"
git push -u origin main

# 推送标签
echo -e "${YELLOW}🏷️  推送标签 v1.0.0...${NC}"
git push origin v1.0.0

echo ""
echo -e "${GREEN}✅ 推送完成！${NC}"
echo ""
echo -e "${GREEN}📦 仓库地址: https://github.com/hjw472015868/theme${NC}"
echo -e "${YELLOW}💡 在其他项目中使用:${NC}"
echo -e "${YELLOW}   \"@km-design/theme-system\": \"git+https://github.com/hjw472015868/theme.git#v1.0.0\"${NC}"

