#!/bin/bash

# GitHub 发布脚本
# 使用方法: bash scripts/release.sh

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

echo -e "${GREEN}🚀 开始发布 v${VERSION}...${NC}"

# 检查 git 仓库
if [ ! -d ".git" ]; then
  echo -e "${RED}❌ 错误: 当前目录不是 git 仓库${NC}"
  echo -e "${YELLOW}💡 请先初始化 git 仓库:${NC}"
  echo -e "${YELLOW}   git init${NC}"
  echo -e "${YELLOW}   git remote add origin https://github.com/your-username/theme-system.git${NC}"
  exit 1
fi

# 检查远程仓库
if ! git remote get-url origin &> /dev/null; then
  echo -e "${RED}❌ 错误: 未配置远程仓库${NC}"
  echo -e "${YELLOW}💡 请先添加远程仓库:${NC}"
  echo -e "${YELLOW}   git remote add origin https://github.com/your-username/theme-system.git${NC}"
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

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}📝 发现未提交的更改:${NC}"
  git status --short
  echo ""
  read -p "是否继续? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ 取消发布${NC}"
    exit 1
  fi
fi

# 添加构建文件
echo -e "${YELLOW}📝 添加构建文件...${NC}"
git add dist presets package.json

# 检查是否有更改需要提交
if [ -z "$(git diff --cached --name-only)" ]; then
  echo -e "${YELLOW}⚠️  没有更改需要提交${NC}"
else
  # 提交
  echo -e "${YELLOW}📝 提交更改...${NC}"
  git commit -m "Build: v${VERSION}" || echo "没有更改需要提交"
fi

# 创建或更新标签
echo -e "${YELLOW}🏷️  创建标签 v${VERSION}...${NC}"
if git rev-parse "v${VERSION}" >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  标签 v${VERSION} 已存在，将更新${NC}"
  git tag -f "v${VERSION}"
else
  git tag "v${VERSION}"
fi

# 确认推送
echo ""
echo -e "${YELLOW}⚠️  即将推送到 GitHub${NC}"
echo -e "${YELLOW}   远程仓库: $(git remote get-url origin)${NC}"
echo -e "${YELLOW}   版本: v${VERSION}${NC}"
read -p "是否继续? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}❌ 取消发布${NC}"
  exit 1
fi

# 推送
echo -e "${YELLOW}📤 推送到 GitHub...${NC}"
git push
git push origin "v${VERSION}" --force

echo ""
echo -e "${GREEN}✅ 发布完成！${NC}"
echo ""
echo -e "${GREEN}📦 在其他项目中使用:${NC}"
echo -e "${YELLOW}   \"@km-design/theme-system\": \"git+https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')#v${VERSION}\"${NC}"
echo ""
echo -e "${YELLOW}💡 或在 GitHub 上创建 Release:${NC}"
echo -e "${YELLOW}   https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/releases/new${NC}"

