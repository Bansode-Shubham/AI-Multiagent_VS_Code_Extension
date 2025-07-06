import { AIService } from '../services/aiService';
import { SecurityIssue } from '../types';
export declare class SecurityAgent {
    private aiService;
    constructor(aiService: AIService);
    analyzeSecurityIssues(code: string, language: string): Promise<SecurityIssue[]>;
    scanDependencies(packageJson: string): Promise<SecurityIssue[]>;
    generateSecurityFix(issue: SecurityIssue, code: string): Promise<string>;
}
//# sourceMappingURL=securityAgent.d.ts.map