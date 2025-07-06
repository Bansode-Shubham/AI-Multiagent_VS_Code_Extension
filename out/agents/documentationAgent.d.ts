import { AIService } from '../services/aiService';
export interface DocumentationConfig {
    includeExamples?: boolean;
    includeTesting?: boolean;
    includePerformance?: boolean;
    outputFormat?: 'markdown' | 'html' | 'plain';
    detailLevel?: 'basic' | 'detailed' | 'comprehensive';
}
export interface CodeAnalysis {
    complexity: number;
    maintainability: number;
    testability: number;
    suggestions: string[];
}
export declare class DocumentationAgent {
    private aiService;
    private defaultConfig;
    constructor(aiService: AIService, config?: DocumentationConfig);
    generateCodeDocumentation(code: string, language: string, config?: DocumentationConfig): Promise<string>;
    generateErrorResolutionDocs(error: string, code: string, language: string, config?: DocumentationConfig): Promise<string>;
    generateAPIDocumentation(code: string, language: string, config?: DocumentationConfig): Promise<string>;
    generateTroubleshootingGuide(issue: string, context: string, config?: DocumentationConfig): Promise<string>;
    analyzeCodeQuality(code: string, language: string): Promise<CodeAnalysis>;
    generateArchitecturalDocs(codebase: string[], projectName: string, config?: DocumentationConfig): Promise<string>;
    generateTestingDocs(code: string, language: string, config?: DocumentationConfig): Promise<string>;
    generateChangeLog(oldCode: string, newCode: string, language: string): Promise<string>;
    generateSecurityDocs(code: string, language: string, config?: DocumentationConfig): Promise<string>;
    generatePerformanceDocs(code: string, language: string, config?: DocumentationConfig): Promise<string>;
    generateComprehensiveDocs(code: string, language: string, projectName: string, config?: DocumentationConfig): Promise<{
        codeDocumentation: string;
        apiDocumentation: string;
        testingDocs: string;
        securityDocs: string;
        performanceDocs: string;
        qualityAnalysis: CodeAnalysis;
    }>;
    private buildDocumentationPrompt;
    setDefaultConfig(config: DocumentationConfig): void;
}
//# sourceMappingURL=documentationAgent.d.ts.map