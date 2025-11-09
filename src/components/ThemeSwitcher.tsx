/**
 * 主题切换器组件
 * 提供可视化的主题切换界面
 */

import React from 'react';
import { Dropdown, Button, Space, Tag } from 'antd';
import { BgColorsOutlined, CheckOutlined } from '@ant-design/icons';
import { useTheme, getThemeMetadata } from '../provider/ThemeProvider';
import type { MenuProps } from 'antd';

// 按钮样式对象
const buttonStyle: React.CSSProperties = {
  backgroundColor: 'var(--primary)',
  color: 'var(--primary-foreground)',
  borderColor: 'var(--primary)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  fontWeight: 500,
  transition: 'all 0.3s ease',
};

// 内联样式用于 hover 效果
const hoverEffectClass = `
  .theme-switcher-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  }
  .theme-switcher-button:active {
    transform: translateY(0);
  }
`;

/**
 * 主题切换器属性
 */
interface ThemeSwitcherProps {
  type?: 'button' | 'dropdown'; // 显示类型
  showIcon?: boolean; // 是否显示图标
  size?: 'small' | 'middle' | 'large'; // 按钮大小
  className?: string; // 自定义类名
}

/**
 * 主题切换器组件
 */
const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  type = 'dropdown',
  showIcon = true,
  size = 'middle',
  className,
}) => {
  const { currentTheme, switchTheme, availableThemes } = useTheme();

  // 注入全局样式
  React.useEffect(() => {
    const styleId = 'theme-switcher-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = hoverEffectClass;
      document.head.appendChild(style);
    }
  }, []);

  // 生成菜单项
  const menuItems: MenuProps['items'] = availableThemes.map((themeName) => {
    const metadata = getThemeMetadata(themeName);
    const isActive = currentTheme === themeName;

    return {
      key: themeName,
      label: (
        <Space>
          <span>{metadata?.name || themeName}</span>
          {isActive && <CheckOutlined style={{ color: '#52c41a' }} />}
          {metadata?.mode === 'dark' && <Tag color="blue">暗色</Tag>}
          {metadata?.type === 'festival' && <Tag color="red">节日</Tag>}
        </Space>
      ),
      onClick: () => switchTheme(themeName),
    };
  });

  // 按钮类型
  if (type === 'button') {
    const metadata = getThemeMetadata(currentTheme);
    return (
      <Button
        type="default"
        size={size}
        className={`theme-switcher-button ${className || ''}`}
        icon={showIcon ? <BgColorsOutlined /> : undefined}
        style={buttonStyle}
        onClick={() => {
          // 简单轮换主题
          const currentIndex = availableThemes.indexOf(currentTheme);
          const nextIndex = (currentIndex + 1) % availableThemes.length;
          switchTheme(availableThemes[nextIndex]);
        }}
      >
        {metadata?.name || currentTheme}
      </Button>
    );
  }

  // 下拉菜单类型（默认）
  const metadata = getThemeMetadata(currentTheme);
  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
      <Button
        type="default"
        size={size}
        className={`theme-switcher-button ${className || ''}`}
        icon={showIcon ? <BgColorsOutlined /> : undefined}
        style={buttonStyle}
      >
        {metadata?.name || currentTheme}
      </Button>
    </Dropdown>
  );
};

export default ThemeSwitcher;
export { ThemeSwitcher };

