/**
 * 主题编辑器组件
 * 提供可视化的主题配置界面，支持导入导出 JSON 配置
 */

import React, { useState, useMemo } from 'react';
import {
  Drawer,
  Tabs,
  ColorPicker,
  InputNumber,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  message,
  Upload,
  Card,
  Radio,
  Select,
  Collapse,
  Tooltip,
  Modal,
  Slider,
} from 'antd';
import {
  DownloadOutlined,
  UploadOutlined,
  ReloadOutlined,
  SaveOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  BorderOutlined,
  ColumnWidthOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { Color, ColorPickerProps } from 'antd/es/color-picker';
import { debounce } from 'lodash';
import {
  useTheme,
  getThemeMetadata,
  isPresetTheme,
  registerTheme,
  unregisterTheme,
} from '../provider/ThemeProvider';
import type { ThemeConfig } from '../tokens/types';
import { ThemeTransformer, applyCSSVariables } from '../transformer';
import './ThemeEditor.less';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ThemeEditorProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 主题编辑器组件
 */
export const ThemeEditor: React.FC<ThemeEditorProps> = ({ open, onClose }) => {
  const { currentTheme, themeConfig, switchTheme, availableThemes } = useTheme();
  // 确保 themeConfig 不为 null
  const safeThemeConfig = themeConfig || ({} as ThemeConfig);
  const [editingConfig, setEditingConfig] = useState<ThemeConfig>(safeThemeConfig);
  const [originalConfig, setOriginalConfig] = useState<ThemeConfig>(safeThemeConfig); // 保存原始配置
  const [presetOriginalConfig, setPresetOriginalConfig] = useState<ThemeConfig | null>(null); // 保存预设主题的真正原始配置
  const [activeTab, setActiveTab] = useState('themes');
  const [refreshKey, setRefreshKey] = useState(0); // 用于强制刷新主题列表

  // 当抽屉打开时，保存当前配置作为原始配置，并加载自定义主题到系统
  React.useEffect(() => {
    if (open && themeConfig) {
      setOriginalConfig(themeConfig);
      setEditingConfig(themeConfig);
      
      // 如果是预设主题，尝试从预设文件中加载真正的原始配置
      if (isPresetTheme(currentTheme)) {
        try {
          // 预设主题已经在 ThemeProvider 中加载，可以直接获取
          // 但可能被 localStorage 覆盖了，所以这里保存当前配置作为备份
          setPresetOriginalConfig(themeConfig);
        } catch (error) {
          console.error('获取预设主题原始配置失败:', error);
          setPresetOriginalConfig(null);
        }
      } else {
        setPresetOriginalConfig(null);
      }
      
      // 从 localStorage 加载自定义主题并注册到系统
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('km-theme-custom-')) {
          try {
            const themeData = localStorage.getItem(key);
            if (themeData) {
              const themeName = key.replace('km-theme-', '');
              const themeConfig = JSON.parse(themeData);
              registerTheme(themeName, themeConfig);
            }
          } catch (error) {
            console.error('加载主题失败:', key, error);
          }
        }
      }
      
      // 强制刷新
      setRefreshKey(prev => prev + 1);
    }
  }, [open, themeConfig, currentTheme]);

  // 颜色转换辅助函数
  const colorToHex = (color?: Color | string | null): string => {
    if (!color) return '#000000';
    if (typeof color === 'string') return color;
    return color.toHexString();
  };

  // 更新配置（实时应用）
  const updateConfig = React.useCallback((path: string[], value: any) => {
    let updatedConfig: ThemeConfig | null = null;
    
    setEditingConfig((prev) => {
      const newConfig = JSON.parse(JSON.stringify(prev));
      let current = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      
      updatedConfig = newConfig;
      
      // 实时应用配置（通过 CSS 变量）
      applyConfigRealtime(newConfig);
      
      return newConfig;
    });
    
    return updatedConfig;
  }, []);

  // 实时应用配置
  const applyConfigRealtime = (config: ThemeConfig) => {
    try {
      const transformer = new ThemeTransformer(config);
      const cssVars = transformer.toCSSVariables();
      applyCSSVariables(cssVars);
    } catch (error) {
      console.error('应用主题配置失败:', error);
    }
  };

  // 导出配置
  const handleExport = () => {
    const dataStr = JSON.stringify(editingConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `theme-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    message.success('主题配置已导出');
  };

  // 导入配置（添加新主题并立即切换）
  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string) as ThemeConfig;
        
        // 生成新主题key和名称
        const themeKey = `custom-${Date.now()}`;
        const themeName = config.meta?.name || `导入主题-${Date.now()}`;
        const fileName = `${themeKey}.json`;
        
        // 更新配置中的名称
        config.meta = {
          ...config.meta,
          name: themeName,
        };
        
        // 1. 保存到 localStorage（临时持久化）
        localStorage.setItem(`km-theme-${themeKey}`, JSON.stringify(config));
        
        // 2. 注册到主题系统（立即可用）
        registerTheme(themeKey, config);
        
        // 3. 切换到新导入的主题
        switchTheme(themeKey);
        
        // 4. 更新编辑配置
        setEditingConfig(config);
        
        // 5. 强制刷新列表
        setRefreshKey(prev => prev + 1);
        
        Modal.info({
          title: '主题已导入',
          content: (
            <div>
              <p>✅ 主题"{themeName}"已导入并保存到浏览器缓存</p>
              <p>⚠️ <strong>注意：</strong>清除浏览器缓存后主题将丢失</p>
              <p style={{ marginTop: 16, padding: 12, background: '#fff3cd', borderRadius: 4 }}>
                💡 <strong>永久保存方法：</strong><br/>
                1. 点击右上角"导出"按钮导出主题文件<br/>
                2. 将文件重命名为有意义的名称（如 <code>my-theme.json</code>）<br/>
                3. 放到以下目录：<br/>
                <code style={{ fontSize: 12 }}>
                  km-artizen-ui/apps/km-artizen-ai-ui/src/theme/presets/
                </code><br/>
                4. 在 <code>ThemeProvider.tsx</code> 中导入该文件
              </p>
            </div>
          ),
          width: 600,
        });
      } catch (error) {
        message.error('配置文件格式错误');
      }
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 保存当前编辑为新主题
  const handleSaveAsNewTheme = () => {
    const themeName = prompt('请输入新主题名称：', `自定义主题-${new Date().toLocaleDateString()}`);
    if (!themeName) return;
    
    // 更新主题配置的名称
    const newConfig = {
      ...editingConfig,
      meta: {
        ...editingConfig.meta,
        name: themeName,
      },
    };
    
    const themeKey = `custom-${Date.now()}`;
    const fileName = `${themeKey}.json`;
    
    // 1. 保存到 localStorage（临时持久化）
    localStorage.setItem(`km-theme-${themeKey}`, JSON.stringify(newConfig));
    
    // 2. 注册到主题系统（立即可用）
    registerTheme(themeKey, newConfig);
    
    // 3. 切换到新保存的主题
    switchTheme(themeKey);
    
    // 4. 强制刷新列表
    setRefreshKey(prev => prev + 1);
    
    // 5. 自动导出主题文件
    const dataStr = JSON.stringify(newConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    
    Modal.info({
      title: '主题已保存',
      content: (
        <div>
          <p>✅ 主题"{themeName}"已保存到浏览器缓存</p>
          <p>📥 主题文件已下载: <code>{fileName}</code></p>
          <p style={{ marginTop: 16, padding: 12, background: '#f0f0f0', borderRadius: 4 }}>
            💡 <strong>永久保存方法：</strong><br/>
            请将下载的 JSON 文件放到以下目录：<br/>
            <code style={{ fontSize: 12 }}>
              km-artizen-ui/apps/km-artizen-ai-ui/src/theme/presets/
            </code><br/>
            然后在代码中导入该主题即可永久使用。
          </p>
        </div>
      ),
      width: 600,
    });
  };

  // 保存当前修改（应用并持久化）
  const handleSaveChanges = () => {
    try {
      // 检查是否有修改
      const hasChanges = JSON.stringify(editingConfig) !== JSON.stringify(originalConfig);
      
      if (!hasChanges) {
        message.info('没有需要保存的修改');
        onClose();
        return;
      }

      // 保存修改到 localStorage（覆盖方式）
      const storageKey = `km-theme-override-${currentTheme}`;
      localStorage.setItem(storageKey, JSON.stringify(editingConfig));
      
      // 如果是预设主题，注册覆盖版本
      if (isPresetTheme(currentTheme)) {
        // 注册覆盖版本（保持原主题名，但使用新配置）
        registerTheme(currentTheme, editingConfig);
      } else {
        // 自定义主题直接更新
        const customKey = `km-theme-${currentTheme}`;
        localStorage.setItem(customKey, JSON.stringify(editingConfig));
        registerTheme(currentTheme, editingConfig);
      }
      
      // 应用配置
      applyConfigRealtime(editingConfig);
      
      // 刷新主题（确保使用最新配置）
      switchTheme(currentTheme);
      
      message.success({
        content: '主题修改已保存',
        duration: 3,
      });
      
      onClose();
    } catch (error) {
      console.error('保存主题失败:', error);
      message.error('保存失败，请重试');
    }
  };

  // 取消编辑（恢复原始配置）
  const handleCancel = () => {
    // 恢复原始配置
    applyConfigRealtime(originalConfig);
    setEditingConfig(originalConfig);
    onClose();
  };

  // 重置配置（清除所有修改，恢复到预设主题）
  const handleReset = () => {
    // 检查当前主题是否为预设主题
    const isPreset = isPresetTheme(currentTheme);
    const metadata = getThemeMetadata(currentTheme);
    const themeName = metadata?.name || currentTheme;
    
    Modal.confirm({
      title: '确认重置主题配置',
      icon: <ReloadOutlined style={{ color: '#faad14' }} />,
      content: (
        <div>
          {isPreset ? (
            <>
              <p>即将重置主题 <strong>"{themeName}"</strong> 到最原始的预设配置</p>
              <p style={{ marginTop: 12, padding: 8, background: '#fff7e6', borderRadius: 4, fontSize: 13 }}>
                ⚠️ <strong>注意：</strong>您的所有修改将被清除，此操作不可撤销
              </p>
            </>
          ) : (
            <>
              <p>当前主题 <strong>"{themeName}"</strong> 是自定义主题</p>
              <p style={{ marginTop: 12, padding: 8, background: '#fff7e6', borderRadius: 4, fontSize: 13 }}>
                ⚠️ <strong>注意：</strong>重置将恢复到该主题最初保存时的状态
              </p>
            </>
          )}
        </div>
      ),
      okText: '确认重置',
      okButtonProps: { danger: true },
      cancelText: '取消',
      width: 460,
      onOk: () => {
        try {
          // 1. 清除 localStorage 中的覆盖配置
          const overrideKey = `km-theme-override-${currentTheme}`;
          const hadOverride = localStorage.getItem(overrideKey) !== null;
          localStorage.removeItem(overrideKey);
        
          // 2. 如果是自定义主题，重新加载最初保存的版本
          if (!isPreset) {
            const customKey = `km-theme-${currentTheme}`;
            const savedConfig = localStorage.getItem(customKey);
            if (savedConfig) {
              const parsedConfig = JSON.parse(savedConfig) as ThemeConfig;
              registerTheme(currentTheme, parsedConfig);
            }
          }
          
          // 3. 关闭抽屉，触发重新打开以加载最新配置
          onClose();
          
          // 4. 短暂延迟后重新切换主题，确保配置重新加载
          setTimeout(() => {
            // 触发主题刷新
        switchTheme(currentTheme);
        
            message.success({
              content: hadOverride 
                ? `主题"${themeName}"已重置为原始配置` 
                : `主题"${themeName}"已刷新`,
              duration: 2,
            });
          }, 50);
          
        } catch (error) {
          console.error('重置主题失败:', error);
          message.error('重置失败，请重试');
        }
      },
    });
  };

  // 删除主题
  const handleDeleteTheme = (themeKey: string) => {
    // 检查是否是预设主题
    if (isPresetTheme(themeKey)) {
      message.warning('默认主题不能删除');
      return;
    }
    
    const metadata = getThemeMetadata(themeKey);
    const themeName = metadata?.name || themeKey;
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除主题"${themeName}"吗？`,
      onOk: () => {
        // 1. 从 localStorage 删除
        localStorage.removeItem(`km-theme-${themeKey}`);
        
        // 2. 从主题系统注销
        unregisterTheme(themeKey);
        
        // 3. 如果删除的是当前主题，切换到默认主题
        if (currentTheme === themeKey) {
          switchTheme('default');
        }
        
        // 4. 强制刷新列表
        setRefreshKey(prev => prev + 1);
        
        message.success(`主题"${themeName}"已删除`);
      },
    });
  };

  // 颜色字段中文映射
  const colorLabelMap: Record<string, string> = {
    // 语义化颜色
    background: '背景色',
    foreground: '前景色',
    card: '卡片背景',
    cardForeground: '卡片文字',
    cardBorder: '卡片边框',
    border: '边框色',
    input: '输入框边框',
    muted: '静音背景',
    mutedForeground: '静音文字',
    accent: '强调背景',
    accentForeground: '强调文字',
    destructive: '危险操作',
    destructiveForeground: '危险文字',
    link: '链接色',
    linkHover: '链接悬停',
    // 色阶
    '50': '最浅',
    '100': '很浅',
    '200': '较浅',
    '300': '浅色',
    '400': '淡色',
    '500': '主色',
    '600': '深色',
    '700': '较深',
    '800': '很深',
    '900': '最深',
  };

  // 颜色输入组件（避免焦点丢失，支持平滑选色）
  const ColorInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    colorPath?: string[]; // 颜色在配置中的路径，用于实时预览
  }> = React.memo(({ label, value, onChange, colorPath }) => {
    const [localValue, setLocalValue] = React.useState(value);
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [tempColor, setTempColor] = React.useState(value);
    const colorPickerRef = React.useRef<HTMLDivElement>(null);

    // 获取中文标签
    const zhLabel = colorLabelMap[label] || label;

    React.useEffect(() => {
      setLocalValue(value);
      setTempColor(value);
    }, [value]);

    // 点击外部区域时关闭选择器
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (pickerOpen && colorPickerRef.current && 
            !colorPickerRef.current.contains(event.target as Node)) {
          // 点击外部，关闭选择器并应用最终颜色到配置
          setPickerOpen(false);
          if (tempColor !== value) {
            onChange(tempColor);
          }
        }
      };

      if (pickerOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
      return undefined;
    }, [pickerOpen, tempColor, value, onChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      // 不立即调用onChange，避免焦点丢失
    };

    const handleInputBlur = () => {
      onChange(localValue);
    };

    // 拖动选色时：只更新本地状态 + 直接更新 CSS 变量实现实时预览
    const handleColorChange = (color: Color) => {
      const hexColor = colorToHex(color);
      setTempColor(hexColor);
      setLocalValue(hexColor);
      
      // ⭐ 关键：不调用 onChange（避免父组件重新渲染），而是直接更新 CSS 变量
      if (colorPath && colorPath.length >= 3) {
        // 根据颜色路径构建正确的 CSS 变量名
        let varName: string;
        if (colorPath[1] === 'semantic') {
          // 语义化颜色：--background, --foreground, --content-bg 等
          // 需要将驼峰命名转为 kebab-case
          const kebabKey = colorPath[2].replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
          varName = `--${kebabKey}`;
        } else {
          // 主色板和其他颜色：--primary-500, --success-500 等
          varName = `--${colorPath[1]}-${colorPath[2]}`;
        }
        document.documentElement.style.setProperty(varName, hexColor);
      }
    };

    // 完全控制打开/关闭，不让 ColorPicker 自动关闭
    const handleOpenChange = (open: boolean) => {
      // 阻止自动关闭，只允许通过外部点击关闭
      if (!open) {
        // 不自动关闭，保持打开状态
        return;
      }
      setPickerOpen(open);
    };

    return (
      <div className="color-item" ref={colorPickerRef}>
        {/* 英文标签（顶部） */}
        <div className="color-label-en">{label}</div>
        
        {/* 中文标签（中间） */}
        <div className="color-label-zh">{zhLabel}</div>
        
        {/* 底部：颜色选择器和输入框 */}
        <div className="color-input-row">
          <ColorPicker
            value={tempColor}
            onChange={handleColorChange}
            open={pickerOpen}
            onOpenChange={handleOpenChange}
            trigger="click"
            destroyTooltipOnHide={false}
            getPopupContainer={(trigger) => trigger.parentElement || document.body}
          />
          <Input
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="#RRGGBB"
          />
        </div>
      </div>
    );
  });

  // 文本输入组件（避免焦点丢失）
  const TextInput: React.FC<{
    label?: string;
    value: string;
    onChange: (value: string) => void;
    style?: React.CSSProperties;
    placeholder?: string;
  }> = React.memo(({ label, value, onChange, style, placeholder }) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
    };

    const handleBlur = () => {
      onChange(localValue);
    };

    return (
      <div className="slider-item">
        {label && <Text>{label}</Text>}
        <Input
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          style={style}
          placeholder={placeholder}
        />
      </div>
    );
  });

  // 通用滑块组件（支持实时预览）
  const GenericSlider: React.FC<{
    label: string;
    value: string | number; // 如 "14px" 或 400
    onChange: (value: string | number) => void;
    min?: number;
    max?: number;
    unit?: string; // 如 "px", "rem", "" (无单位)
    cssVarName?: string; // CSS 变量名，如 "--font-size-base"
    step?: number; // 步进值
    useNumberValue?: boolean; // 是否返回数字类型（字体字重用）
  }> = React.memo(({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    unit = 'px',
    cssVarName,
    step = 1,
    useNumberValue = false,
  }) => {
    // 解析数值
    const parseValue = (val: string | number): number => {
      if (typeof val === 'number') return val;
      const match = val.match(/^(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : min;
    };

    const [localValue, setLocalValue] = React.useState<number>(parseValue(value));

    React.useEffect(() => {
      setLocalValue(parseValue(value));
    }, [value]);

    // 滑动时实时更新 CSS 变量（不触发配置更新，避免重渲染）
    const handleSliderChange = (newValue: number) => {
      setLocalValue(newValue);
      
      // 如果提供了 CSS 变量名，直接更新 CSS 变量实现实时预览
      if (cssVarName) {
        const cssValue = unit ? `${newValue}${unit}` : `${newValue}`;
        document.documentElement.style.setProperty(cssVarName, cssValue);
      }
    };

    // 滑动结束时才更新配置（持久化）
    const handleSliderAfterChange = (newValue: number) => {
      if (useNumberValue) {
        onChange(newValue);
      } else {
        onChange(unit ? `${newValue}${unit}` : `${newValue}`);
      }
    };

    // 格式化显示值
    const displayValue = unit ? `${localValue}${unit}` : localValue;

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 16,
        marginBottom: 20,
        paddingRight: 12,
      }}>
        {/* 左边：标签 */}
        <Text style={{ 
          fontSize: 13, 
          fontWeight: 500,
          minWidth: 100,
          flexShrink: 0,
        }}>
          {label}
        </Text>

        {/* 中间：当前值 */}
        <Text style={{ 
          fontSize: 13, 
          color: '#1890ff',
          fontWeight: 600,
          minWidth: 80,
          flexShrink: 0,
        }}>
          当前值：{displayValue}
        </Text>

        {/* 右边：滑块 */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <Slider
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={handleSliderChange}
            onAfterChange={handleSliderAfterChange}
            tooltip={{ formatter: (val) => unit ? `${val}${unit}` : `${val}` }}
          />
        </div>
      </div>
    );
  });

  // 所有主题标签页
  const AllThemes = () => {
    // 检查主题是否有覆盖配置
    const hasOverride = (themeKey: string): boolean => {
      try {
        const overrideKey = `km-theme-override-${themeKey}`;
        return localStorage.getItem(overrideKey) !== null;
      } catch {
        return false;
      }
    };

    return (
      <div className="theme-editor-themes" key={refreshKey}>
        <Paragraph type="secondary">
          选择一个主题作为起点，然后在其他标签页中进行自定义调整
        </Paragraph>
        <div className="theme-grid">
          {availableThemes.map((themeKey) => {
            const isPreset = isPresetTheme(themeKey);
            const metadata = getThemeMetadata(themeKey);
            const themeName = metadata?.name || themeKey;
            const themeDescription = metadata?.description || (isPreset ? '' : '自定义主题');
            const isActive = currentTheme === themeKey;
            const canDelete = !isPreset;
            const isModified = hasOverride(themeKey);
            
            return (
              <Card
                key={themeKey}
                hoverable
                size="small"
                className={`theme-card ${isActive ? 'active' : ''} ${isModified ? 'modified' : ''}`}
                onClick={() => switchTheme(themeKey)}
                extra={canDelete && (
                  <DeleteOutlined 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTheme(themeKey);
                    }}
                    style={{ color: '#ff4d4f' }}
                  />
                )}
              >
                {isActive && (
                  <CheckCircleOutlined className="active-icon" />
                )}
                <div className="theme-preview">
                  <div className="theme-name">
                    {themeName}
                    {isModified && (
                      <Tooltip title="此主题已修改">
                        <span style={{ marginLeft: 6, color: '#1890ff', fontSize: 12 }}>
                          ●
                        </span>
                      </Tooltip>
                    )}
                  </div>
                  {themeDescription && (
                    <div className="theme-description">{themeDescription}</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // 颜色配置标签页
  const ColorSettings = () => (
    <div className="theme-editor-section">
      <Collapse
        defaultActiveKey={['semantic', 'primary']}
        items={[
          {
            key: 'semantic',
            label: '语义化颜色',
            children: (
              <div className="color-settings-grid">
                {Object.entries(editingConfig.colors.semantic).map(([key, value]) => (
                  <ColorInput
                    key={key}
                    label={key}
                    value={value}
                    colorPath={['colors', 'semantic', key]}
                    onChange={(newValue) =>
                      updateConfig(['colors', 'semantic', key], newValue)
                    }
                  />
                ))}
              </div>
            ),
          },
          {
            key: 'primary',
            label: '主色板',
            children: (
              <div className="color-settings-grid">
                {Object.entries(editingConfig.colors.primary).map(([key, value]) => (
                  <ColorInput
                    key={key}
                    label={key}
                    value={value}
                    colorPath={['colors', 'primary', key]}
                    onChange={(newValue) =>
                      updateConfig(['colors', 'primary', key], newValue)
                    }
                  />
                ))}
              </div>
            ),
          },
          {
            key: 'secondary',
            label: '辅助色板',
            children: (
              <div className="color-settings-grid">
                {Object.entries(editingConfig.colors.secondary).map(([key, value]) => (
                  <ColorInput
                    key={key}
                    label={key}
                    value={value}
                    colorPath={['colors', 'secondary', key]}
                    onChange={(newValue) =>
                      updateConfig(['colors', 'secondary', key], newValue)
                    }
                  />
                ))}
              </div>
            ),
          },
          {
            key: 'success',
            label: '成功色板',
            children: (
              <div className="color-settings-grid">
                {Object.entries(editingConfig.colors.success).map(([key, value]) => (
                  <ColorInput
                    key={key}
                    label={key}
                    value={value}
                    colorPath={['colors', 'success', key]}
                    onChange={(newValue) =>
                      updateConfig(['colors', 'success', key], newValue)
                    }
                  />
                ))}
              </div>
            ),
          },
          {
            key: 'warning',
            label: '警告色板',
            children: (
              <div className="color-settings-grid">
                {Object.entries(editingConfig.colors.warning).map(([key, value]) => (
                  <ColorInput
                    key={key}
                    label={key}
                    value={value}
                    colorPath={['colors', 'warning', key]}
                    onChange={(newValue) =>
                      updateConfig(['colors', 'warning', key], newValue)
                    }
                  />
                ))}
              </div>
            ),
          },
          {
            key: 'error',
            label: '错误色板',
            children: (
              <div className="color-settings-grid">
                {Object.entries(editingConfig.colors.error).map(([key, value]) => (
                  <ColorInput
                    key={key}
                    label={key}
                    value={value}
                    colorPath={['colors', 'error', key]}
                    onChange={(newValue) =>
                      updateConfig(['colors', 'error', key], newValue)
                    }
                  />
                ))}
              </div>
            ),
          },
          {
            key: 'info',
            label: '信息色板',
            children: (
              <div className="color-settings-grid">
                {Object.entries(editingConfig.colors.info).map(([key, value]) => (
                  <ColorInput
                    key={key}
                    label={key}
                    value={value}
                    colorPath={['colors', 'info', key]}
                    onChange={(newValue) =>
                      updateConfig(['colors', 'info', key], newValue)
                    }
                  />
                ))}
              </div>
            ),
          },
          {
            key: 'neutral',
            label: '中性色板',
            children: (
              <div className="color-settings-grid">
                {Object.entries(editingConfig.colors.neutral).map(([key, value]) => (
                  <ColorInput
                    key={key}
                    label={key}
                    value={value}
                    colorPath={['colors', 'neutral', key]}
                    onChange={(newValue) =>
                      updateConfig(['colors', 'neutral', key], newValue)
                    }
                  />
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );

  // 字体配置标签页
  const TypographySettings = () => {
    // 常用字体选项
    const fontFamilyOptions = [
      { 
        key: 'system',
        label: '系统默认', 
        value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        description: '根据操作系统自动选择最佳字体'
      },
      { 
        key: 'pingfang',
        label: '苹方', 
        value: 'PingFang SC, -apple-system, sans-serif',
        description: 'Apple 苹方字体，适合 macOS 和 iOS'
      },
      { 
        key: 'yahei',
        label: '微软雅黑', 
        value: 'Microsoft YaHei, sans-serif',
        description: '微软雅黑，适合 Windows'
      },
      { 
        key: 'sourcehansans',
        label: '思源黑体', 
        value: '"Source Han Sans SC", "Noto Sans CJK SC", sans-serif',
        description: 'Adobe 与 Google 合作的开源字体'
      },
      { 
        key: 'alibaba',
        label: '阿里巴巴普惠体', 
        value: '"Alibaba PuHuiTi", sans-serif',
        description: '阿里巴巴开源的企业字体'
      },
      { 
        key: 'lxgw',
        label: '霞鹜文楷', 
        value: '"LXGW WenKai", serif',
        description: '开源楷体，适合文艺风格'
      },
      { 
        key: 'arial',
        label: 'Arial', 
        value: 'Arial, Helvetica, sans-serif',
        description: '经典西文字体'
      },
      { 
        key: 'roboto',
        label: 'Roboto', 
        value: 'Roboto, sans-serif',
        description: 'Google Material Design 默认字体'
      },
    ];

    // 字体大小中文标签
    const fontSizeLabels: Record<string, string> = {
      xs: '超小 (xs)',
      sm: '小 (sm)',
      base: '基础 (base)',
      lg: '大 (lg)',
      xl: '超大 (xl)',
      '2xl': '2倍大 (2xl)',
      '3xl': '3倍大 (3xl)',
      '4xl': '4倍大 (4xl)',
    };

    // 字体字重中文标签
    const fontWeightLabels: Record<string, string> = {
      light: '细体 (Light)',
      normal: '常规 (Normal)',
      medium: '中等 (Medium)',
      semibold: '半粗 (Semibold)',
      bold: '粗体 (Bold)',
    };

    const currentFontFamily = editingConfig.typography.fontFamily.sans.join(', ');
    
    // 根据当前字体栈找到对应的 key
    const getCurrentFontKey = () => {
      const match = fontFamilyOptions.find(opt => opt.value === currentFontFamily);
      return match ? match.key : currentFontFamily;
    };

    return (
      <div className="theme-editor-section">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* 字体族下拉选择 */}
          <div>
            <Title level={5}>字体族</Title>
            <Select
              style={{ width: '100%' }}
              value={getCurrentFontKey()}
              onChange={(key) => {
                const selected = fontFamilyOptions.find(opt => opt.key === key);
                if (selected) {
                  updateConfig(
                    ['typography', 'fontFamily', 'sans'],
                    selected.value.split(',').map((s) => s.trim())
                  );
                }
              }}
              placeholder="选择字体"
              optionLabelProp="label"
            >
              {fontFamilyOptions.map((option) => (
                <Select.Option key={option.key} value={option.key} label={option.label}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{option.label}</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
                      {option.description}
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              💡 选择一个主字体，系统会自动添加适配的备用字体
            </Text>
          </div>
        
          {/* 字体大小 */}
          <div>
            <Title level={5}>字体大小</Title>
            <div style={{ paddingTop: 8 }}>
              {Object.entries(editingConfig.typography.fontSize).map(([key, value]) => (
                <GenericSlider
                  key={key}
                  label={fontSizeLabels[key] || key}
                  value={value}
                  onChange={(newValue) => updateConfig(['typography', 'fontSize', key], newValue)}
                  min={10}
                  max={48}
                  unit="px"
                  cssVarName={`--font-size-${key}`}
                />
              ))}
            </div>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              💡 拖动滑块可实时预览字体大小变化
            </Text>
          </div>

          {/* 字体字重 */}
          {editingConfig.typography.fontWeight && (
            <div>
              <Title level={5}>字体字重</Title>
              <div style={{ paddingTop: 8 }}>
                {Object.entries(editingConfig.typography.fontWeight).map(([key, value]) => (
                  <GenericSlider
                    key={key}
                    label={fontWeightLabels[key] || key}
                    value={value}
                    onChange={(newValue) => updateConfig(['typography', 'fontWeight', key], newValue)}
                    min={100}
                    max={900}
                    step={100}
                    unit=""
                    cssVarName={`--font-weight-${key}`}
                    useNumberValue={true}
                  />
                ))}
              </div>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                💡 字重范围：100-900，400为常规，700为粗体
              </Text>
            </div>
          )}
        </Space>
      </div>
    );
  };

  // 间距配置标签页
  const SpacingSettings = () => {
    // 间距中文标签
    const spacingLabels: Record<string, string> = {
      xs: '超小 (xs)',
      sm: '小 (sm)',
      md: '中等 (md)',
      lg: '大 (lg)',
      xl: '超大 (xl)',
      '2xl': '2倍大 (2xl)',
      '3xl': '3倍大 (3xl)',
    };

    return (
      <div className="theme-editor-section">
        <Title level={5}>间距</Title>
        <div style={{ paddingTop: 8 }}>
          {Object.entries(editingConfig.spacing).map(([key, value]) => (
            <GenericSlider
              key={key}
              label={spacingLabels[key] || key}
              value={value}
              onChange={(newValue) => updateConfig(['spacing', key], newValue)}
              min={0}
              max={64}
              unit="px"
              cssVarName={`--spacing-${key}`}
            />
          ))}
        </div>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
          💡 拖动滑块可实时预览间距变化
        </Text>
      </div>
    );
  };

  // 圆角配置标签页
  const BorderRadiusSettings = () => {
    // 圆角中文标签
    const borderRadiusLabels: Record<string, string> = {
      none: '无圆角 (none)',
      sm: '小 (sm)',
      md: '中等 (md)',
      lg: '大 (lg)',
      xl: '超大 (xl)',
      '2xl': '2倍大 (2xl)',
      full: '完全圆形 (full)',
    };

    return (
      <div className="theme-editor-section">
        <Title level={5}>圆角</Title>
        <div style={{ paddingTop: 8 }}>
          {Object.entries(editingConfig.borderRadius).map(([key, value]) => {
            // full 特殊处理，最大值设置为 9999
            const maxValue = key === 'full' ? 9999 : 32;
            const minValue = 0;
            
            return (
              <GenericSlider
                key={key}
                label={borderRadiusLabels[key] || key}
                value={value}
                onChange={(newValue) => updateConfig(['borderRadius', key], newValue)}
                min={minValue}
                max={maxValue}
                unit="px"
                cssVarName={`--radius-${key}`}
              />
            );
          })}
        </div>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
          💡 拖动滑块可实时预览圆角变化
        </Text>
      </div>
    );
  };

  // 边框配置单行组件（支持平滑拖动颜色选择和滑块调节宽度）
  const BorderConfigRow: React.FC<{
    label: string;
    width: string;
    style: string;
    color: string;
    borderValue: string;
    onWidthChange: (width: string) => void;
    onStyleChange: (style: string) => void;
    onColorChange: (color: string) => void;
    borderStyleOptions: Array<{ label: string; value: string }>;
  }> = ({ label, width, style, color, borderValue, onWidthChange, onStyleChange, onColorChange, borderStyleOptions }) => {
    const [localColor, setLocalColor] = React.useState(color);
    const [isPickerOpen, setIsPickerOpen] = React.useState(false);
    const colorPickerRef = React.useRef<HTMLDivElement>(null);
    
    // 边框宽度的本地状态，用于实时预览
    const [localWidth, setLocalWidth] = React.useState<number>(() => {
      return parseFloat(width.replace('px', '')) || 0;
    });

    // 同步外部颜色和宽度到本地状态
    React.useEffect(() => {
      setLocalColor(color);
    }, [color]);

    React.useEffect(() => {
      setLocalWidth(parseFloat(width.replace('px', '')) || 0);
    }, [width]);

    // 点击外部关闭颜色选择器
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isPickerOpen && colorPickerRef.current && 
            !colorPickerRef.current.contains(event.target as Node)) {
          // 点击外部，关闭选择器并应用最终颜色
          setIsPickerOpen(false);
          if (localColor !== color) {
            onColorChange(localColor);
          }
        }
      };

      if (isPickerOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
      return undefined;
    }, [isPickerOpen, localColor, color, onColorChange]);

    // 拖动选色时：立即更新本地状态和CSS变量，不触发配置更新
    const handleColorChange = (color: ColorPickerProps['value']) => {
      if (typeof color === 'string' || (color && !Array.isArray(color))) {
        const hexColor = colorToHex(color);
        setLocalColor(hexColor);
        
        // 根据边框标签获取对应的key实现实时预览
        const borderKey = Object.entries({
          '无边框': 'none',
          '默认边框': 'default', 
          '卡片边框': 'card',
          '输入框边框': 'input',
          '加粗边框': 'thick',
          '虚线边框': 'dashed',
          '点线边框': 'dotted'
        }).find(([labelText]) => labelText === label)?.[1];
        
        if (borderKey) {
          // 实时更新边框颜色CSS变量
          document.documentElement.style.setProperty(`--border-color-${borderKey}`, hexColor);
          
          // 同时更新完整边框变量
          const newBorderValue = localWidth === 0 ? '0' : `${localWidth}px ${style}`;
          const fullBorderValue = localWidth === 0 || style === 'none' ? 'none' : `${newBorderValue} ${hexColor}`;
          document.documentElement.style.setProperty(`--border-full-${borderKey}`, fullBorderValue);
        }
      }
    };

    // 完全阻止自动关闭，只允许通过外部点击关闭
    const handleOpenChange = (open: boolean) => {
      if (!open) {
        // 阻止自动关闭，保持打开状态
        return;
      }
      setIsPickerOpen(open);
    };

    // 边框宽度拖动时的实时预览（不更新配置，避免重渲染）
    const handleWidthChange = (newValue: number) => {
      setLocalWidth(newValue);
      
      // 根据边框标签获取对应的key（从label反推key）
      const borderKey = Object.entries({
        '无边框': 'none',
        '默认边框': 'default', 
        '卡片边框': 'card',
        '输入框边框': 'input',
        '加粗边框': 'thick',
        '虚线边框': 'dashed',
        '点线边框': 'dotted'
      }).find(([labelText]) => labelText === label)?.[1];
      
      if (borderKey) {
        // 实时更新CSS变量实现预览
        document.documentElement.style.setProperty(`--border-width-${borderKey}`, `${newValue}px`);
        
        // 同时更新完整边框变量
        const newBorderValue = newValue === 0 ? '0' : `${newValue}px ${style}`;
        const fullBorderValue = newValue === 0 || style === 'none' ? 'none' : `${newBorderValue} ${localColor}`;
        document.documentElement.style.setProperty(`--border-full-${borderKey}`, fullBorderValue);
      }
    };

    // 边框宽度拖动结束时更新配置
    const handleWidthAfterChange = (newValue: number) => {
      onWidthChange(`${newValue}px`);
    };

    return (
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}
      >
        <Text style={{ width: 100, fontWeight: 500 }}>{label}</Text>

        {/* 宽度滑块 */}
        <div style={{ width: 200, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Slider
            value={style === 'none' ? 0 : localWidth}
            onChange={handleWidthChange}
            onAfterChange={handleWidthAfterChange}
            min={0}
            max={10}
            step={0.5}
            style={{ flex: 1 }}
            disabled={style === 'none'}
            tooltip={{ formatter: (val) => `${val}px` }}
          />
          <Text style={{ fontSize: 12, color: '#1890ff', minWidth: 35 }}>
            {style === 'none' ? '0px' : `${localWidth}px`}
          </Text>
        </div>

        {/* 样式下拉选择 */}
        <Select value={style} onChange={onStyleChange} options={borderStyleOptions} style={{ width: 150 }} />

        {/* 颜色选择器 - 支持平滑拖动 */}
        <div ref={colorPickerRef}>
          <ColorPicker
            value={localColor}
            onChange={handleColorChange}
            open={isPickerOpen}
            onOpenChange={handleOpenChange}
            showText
            size="small"
            trigger="click"
            destroyTooltipOnHide={false}
            getPopupContainer={(trigger) => trigger.parentElement || document.body}
          />
        </div>

        {/* 预览 */}
        <div
          style={{
            width: 60,
            height: 30,
            border: style === 'none' ? 'none' : `${borderValue} ${localColor}`,
            borderRadius: 4,
            background: '#fff',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    );
  };

  // 边框配置标签页
  const BorderSettings = () => {
    const [initialized, setInitialized] = React.useState(false);

    // 当标签页切换时重置初始化状态
    React.useEffect(() => {
      setInitialized(false);
    }, [activeTab]);

    // 确保 borders 配置存在
    React.useEffect(() => {
      if (!initialized && activeTab === 'borders') {
        if (!editingConfig.borders) {
          const defaultBorders = {
            width: {
              none: '0',
              thin: '1px',
              medium: '2px',
              thick: '3px',
            },
            style: {
              solid: 'solid',
              dashed: 'dashed',
              dotted: 'dotted',
            },
            composite: {
              none: '0',
              default: '1px solid',
              card: '1px solid',
              input: '1px solid',
              thick: '2px solid',
              dashed: '1px dashed',
              dotted: '1px dotted',
            },
            colors: {
              none: '#e0e0e0',
              default: '#e0e0e0',
              card: '#e5e7eb',
              input: '#d1d5db',
              thick: '#9e9e9e',
              dashed: '#bdbdbd',
              dotted: '#bdbdbd',
            },
          };
          updateConfig(['borders'], defaultBorders);
        } else if (!editingConfig.borders.colors) {
          const defaultColors = {
            none: '#e0e0e0',
            default: '#e0e0e0',
            card: '#e5e7eb',
            input: '#d1d5db',
            thick: '#9e9e9e',
            dashed: '#bdbdbd',
            dotted: '#bdbdbd',
          };
          updateConfig(['borders', 'colors'], defaultColors);
        }
        setInitialized(true);
      }
    }, [initialized, activeTab, editingConfig.borders]);

    const borderLabelMap: Record<string, string> = {
      none: '无边框',
      default: '默认边框',
      card: '卡片边框',
      input: '输入框边框',
      thick: '加粗边框',
      dashed: '虚线边框',
      dotted: '点线边框',
    };

    const borderStyleOptions = [
      { label: '无 (none)', value: 'none' },
      { label: '实线 (solid)', value: 'solid' },
      { label: '虚线 (dashed)', value: 'dashed' },
      { label: '点线 (dotted)', value: 'dotted' },
    ];

    // 解析边框值（例如 "1px solid" -> { width: "1px", style: "solid" }）
    const parseBorder = (value: string): { width: string; style: string } => {
      const parts = value.trim().split(/\s+/);
      if (parts.length === 1 && (parts[0] === '0' || parts[0] === 'none')) {
        return { width: '0', style: 'none' };
      }
      return {
        width: parts[0] || '1px',
        style: parts[1] || 'solid',
      };
    };

    // 组合边框值
    const combineBorder = (width: string, style: string): string => {
      if (style === 'none') {
        return '0';
      }
      // 确保即使 width 为空也有默认值
      const finalWidth = width && width !== '0' ? width : '1px';
      return `${finalWidth} ${style}`;
    };

    // 如果 borders 配置不存在，显示加载状态
    if (!editingConfig.borders || !editingConfig.borders.colors) {
      return (
        <div className="theme-editor-section">
          <Space direction="vertical" style={{ width: '100%', textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">正在初始化边框配置...</Text>
          </Space>
        </div>
      );
    }

    return (
      <div className="theme-editor-section">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={5}>边框配置</Title>
            <Paragraph type="secondary" style={{ fontSize: 12 }}>
              设置边框宽度、样式和颜色，系统会自动组合并实时预览
            </Paragraph>
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.entries(editingConfig.borders.composite).map(([key, value]) => {
                const { width, style } = parseBorder(value);
                const borderColor = editingConfig.borders?.colors?.[key as keyof typeof editingConfig.borders.colors] || '#e0e0e0';
                
                return (
                  <BorderConfigRow
                    key={key}
                    label={borderLabelMap[key] || key}
                    width={width}
                    style={style}
                    color={borderColor}
                    borderValue={value}
                    onWidthChange={(newWidth) => {
                      const newValue = combineBorder(newWidth, style);
                      updateConfig(['borders', 'composite', key], newValue);
                    }}
                    onStyleChange={(newStyle) => {
                      const newWidth = style === 'none' && newStyle !== 'none' ? '1px' : width;
                      const newValue = combineBorder(newWidth, newStyle);
                      updateConfig(['borders', 'composite', key], newValue);
                    }}
                    onColorChange={(newColor) => {
                      updateConfig(['borders', 'colors', key], newColor);
                    }}
                    borderStyleOptions={borderStyleOptions}
                  />
                );
              })}
            </Space>
          </div>

          <Divider />

          <div style={{ padding: 12, background: '#f0f7ff', borderRadius: 4 }}>
            <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>💡 使用提示</Title>
            <Text style={{ fontSize: 12, color: '#666' }}>
              • <strong>边框宽度：</strong>常用 1px、2px、3px<br/>
              • <strong>边框样式：</strong>实线、虚线、点线、无边框<br/>
              • <strong>边框颜色：</strong>点击颜色块可调整边框颜色<br/>
              • <strong>推荐配置：</strong><br/>
              　- 卡片: 1px 实线 + 浅色边框<br/>
              　- 输入框: 1px 实线 + 中性边框<br/>
              　- 强调: 2px 实线 + 主题色
            </Text>
          </div>
        </Space>
      </div>
    );
  };

  // JSON 编辑器标签页
  const JSONEditor = () => {
    const [jsonText, setJsonText] = useState(JSON.stringify(editingConfig, null, 2));

    const handleJsonChange = (value: string) => {
      setJsonText(value);
      try {
        const parsed = JSON.parse(value);
        setEditingConfig(parsed);
      } catch (error) {
        // 忽略解析错误，用户可能还在编辑
      }
    };

    return (
      <div className="theme-editor-section">
        <Paragraph type="secondary">
          直接编辑 JSON 配置，适合高级用户或批量修改
        </Paragraph>
        <TextArea
          value={jsonText}
          onChange={(e) => handleJsonChange(e.target.value)}
          rows={20}
          style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: 12 }}
        />
      </div>
    );
  };

  const tabItems = [
    {
      key: 'themes',
      label: (
        <span>
          <BgColorsOutlined /> 所有主题
        </span>
      ),
      children: <AllThemes />,
    },
    {
      key: 'colors',
      label: (
        <span>
          <BgColorsOutlined /> 颜色
        </span>
      ),
      children: <ColorSettings />,
    },
    {
      key: 'typography',
      label: (
        <span>
          <FontSizeOutlined /> 字体
        </span>
      ),
      children: <TypographySettings />,
    },
    {
      key: 'spacing',
      label: (
        <span>
          <ColumnWidthOutlined /> 间距
        </span>
      ),
      children: <SpacingSettings />,
    },
    {
      key: 'borderRadius',
      label: (
        <span>
          <BorderOutlined /> 圆角
        </span>
      ),
      children: <BorderRadiusSettings />,
    },
    {
      key: 'borders',
      label: (
        <span>
          <BorderOutlined /> 边框
        </span>
      ),
      children: <BorderSettings />,
    },
    {
      key: 'json',
      label: (
        <span>
          <SaveOutlined /> JSON 编辑
        </span>
      ),
      children: <JSONEditor />,
    },
  ];

  return (
    <Drawer
      title="主题配置中心"
      placement="right"
      width={720}
      open={open}
      onClose={onClose}
      mask={false}
      className="theme-editor-drawer"
      extra={
        <Space>
          <Upload
            accept=".json"
            showUploadList={false}
            beforeUpload={handleImport}
          >
            <Tooltip title="导入 JSON 配置">
              <Button icon={<UploadOutlined />}>导入</Button>
            </Tooltip>
          </Upload>
          <Tooltip title="导出当前配置">
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Tooltip>
          <Tooltip title="重置为原始配置">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReset}
              danger
            />
          </Tooltip>
        </Space>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            icon={<PlusOutlined />} 
            onClick={handleSaveAsNewTheme}
          >
            保存为新主题
          </Button>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveChanges}>
              完成
            </Button>
          </Space>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        tabPosition="left"
        className="theme-editor-tabs"
      />
    </Drawer>
  );
};

export default ThemeEditor;

