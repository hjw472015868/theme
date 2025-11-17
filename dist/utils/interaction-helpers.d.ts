/**
 * 交互状态辅助工具
 * 提供渐进式迁移和最小配置支持
 */
import type { InteractionColors, SemanticColors } from '../tokens/types';
/**
 * 最小交互配置 - 只需要这 3 个就能解决 80% 的问题
 */
export interface MinimalInteractionColors {
    selectedBg: string;
    hoverBg: string;
    disabledBg: string;
}
/**
 * 从最小配置生成完整的 InteractionColors
 * 自动推算缺失的颜色
 */
export declare function expandMinimalInteraction(minimal: MinimalInteractionColors, semanticColors: SemanticColors): InteractionColors;
/**
 * 检查主题是否需要交互配置升级
 */
export declare function needsInteractionUpgrade(semanticColors: SemanticColors): boolean;
/**
 * 为主题生成推荐的最小交互配置
 */
export declare function generateRecommendedMinimalInteraction(semanticColors: SemanticColors, isDark?: boolean): MinimalInteractionColors;
/**
 * 迁移配置模板
 */
export declare const MIGRATION_TEMPLATES: {
    readonly minimal: {
        readonly description: "最小配置：只配置最关键的 3 个状态";
        readonly requiredFields: readonly ["selectedBg", "hoverBg", "disabledBg"];
        readonly solvesProblem: readonly ["Table 行选中不可见", "下拉选项选中不可见", "暗色模式对比度问题"];
    };
    readonly standard: {
        readonly description: "标准配置：覆盖 90% 的交互场景";
        readonly requiredFields: readonly ["selectedBg", "hoverBg", "disabledBg", "focusBg", "focusBorder", "activeBg"];
        readonly solvesProblem: readonly ["键盘导航 focus 状态", "按钮 active 反馈", "表单可访问性"];
    };
    readonly complete: {
        readonly description: "完整配置：精细控制所有交互状态";
        readonly requiredFields: readonly ["defaultBg", "defaultBorder", "defaultText", "hoverBg", "hoverBorder", "hoverText", "activeBg", "activeBorder", "activeText", "focusBg", "focusBorder", "focusRing", "selectedBg", "selectedBorder", "selectedText", "selectedMultipleBg", "selectedMultipleBorder", "selectedMultipleText", "disabledBg", "disabledBorder", "disabledText"];
        readonly solvesProblem: readonly ["设计系统完整性", "AI 规则全覆盖", "品牌一致性"];
    };
};
//# sourceMappingURL=interaction-helpers.d.ts.map