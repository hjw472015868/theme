/**
 * 主题切换器组件
 * 提供可视化的主题切换界面
 */
import React from 'react';
/**
 * 主题切换器属性
 */
interface ThemeSwitcherProps {
    type?: 'button' | 'dropdown';
    showIcon?: boolean;
    size?: 'small' | 'middle' | 'large';
    className?: string;
}
/**
 * 主题切换器组件
 */
declare const ThemeSwitcher: React.FC<ThemeSwitcherProps>;
export default ThemeSwitcher;
export { ThemeSwitcher };
//# sourceMappingURL=ThemeSwitcher.d.ts.map