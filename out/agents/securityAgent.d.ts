import { AIService } from '../services/aiService';
import { SecurityIssue } from '../types';
export interface SecurityMetrics {
    totalIssues: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    coverageScore: number;
}
export interface SecurityScanResult {
    issues: SecurityIssue[];
    metrics: SecurityMetrics;
    scanTime: number;
    timestamp: string;
    context: SecurityContext;
}
export interface SecurityConfig {
    enableStaticAnalysis?: boolean;
    enableDependencyScanning?: boolean;
    enableSecretsDetection?: boolean;
    enableComplianceChecks?: boolean;
    maxSeverityLevel?: 'high' | 'medium' | 'low';
}
export interface SecurityContext {
    framework?: string;
    environment?: 'development' | 'staging' | 'production';
    complianceStandards?: string[];
    customRules?: SecurityRule[];
}
export interface SecurityRule {
    id: string;
    pattern: RegExp;
    severity: 'high' | 'medium' | 'low';
    message: string;
    cweId?: string;
}
export interface EnhancedSecurityIssue extends SecurityIssue {
    id: string;
    column?: number;
    cweId?: string;
    confidence?: number;
    timestamp: string;
}
export declare class SecurityAgent {
    private aiService;
    private config;
    private customRules;
    constructor(aiService: AIService, config?: SecurityConfig);
    performComprehensiveScan(code: string, language: string, context?: SecurityContext): Promise<SecurityScanResult>;
    analyzeSecurityIssues(code: string, language: string, context?: SecurityContext): Promise<EnhancedSecurityIssue[]>;
    scanDependencies(packageJson: string): Promise<EnhancedSecurityIssue[]>;
    detectHardcodedSecrets(code: string): Promise<EnhancedSecurityIssue[]>;
    validateCustomRules(code: string, rules: SecurityRule[]): Promise<EnhancedSecurityIssue[]>;
    checkCompliance(code: string, standards: string[]): Promise<EnhancedSecurityIssue[]>;
    generateSecurityFix(issue: EnhancedSecurityIssue, code: string): Promise<string>;
    generateSecurityReport(results: SecurityScanResult): Promise<string>;
    addCustomRule(rule: SecurityRule): void;
    removeCustomRule(ruleId: string): void;
    private calculateMetrics;
    private generateIssueId;
}
//# sourceMappingURL=securityAgent.d.ts.map