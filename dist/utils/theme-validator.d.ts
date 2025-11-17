/**
 * 主题健康检查工具
 * 验证主题配置的合理性，包括对比度、一致性等
 */
import type { ThemeConfig } from '../tokens/types';
export interface ValidationResult {
    isValid: boolean;
    level: 'error' | 'warning' | 'info';
    message: string;
    fix?: string;
}
export interface ThemeHealthReport {
    overall: 'healthy' | 'warning' | 'critical';
    errors: ValidationResult[];
    warnings: ValidationResult[];
    suggestions: ValidationResult[];
}
/**
 * 主要的主题健康检查函数
 */
export declare function validateTheme(config: ThemeConfig): ThemeHealthReport;
/**
 * 生成健康报告的可读摘要
 */
export declare function generateHealthSummary(report: ThemeHealthReport): string;
//# sourceMappingURL=theme-validator.d.ts.map