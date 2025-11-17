/**
 * 样式冲突检测工具
 * 检测和处理可能的样式覆盖冲突
 */
export interface StyleConflict {
    type: 'override' | 'specificity' | 'important';
    component: string;
    property: string;
    themeValue: string;
    customValue: string;
    selector: string;
    severity: 'low' | 'medium' | 'high';
    fix: string;
}
export interface ConflictReport {
    conflicts: StyleConflict[];
    recommendations: string[];
}
/**
 * 检测常见的样式冲突模式
 */
export declare function detectStyleConflicts(customStyles: string): ConflictReport;
/**
 * 生成冲突修复建议
 */
export declare function generateFixSuggestions(conflicts: StyleConflict[]): string[];
//# sourceMappingURL=style-conflict-detector.d.ts.map