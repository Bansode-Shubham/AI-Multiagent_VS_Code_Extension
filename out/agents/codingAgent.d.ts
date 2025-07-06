import { AIService } from '../services/aiService';
import { CodeSuggestion, SecurityIssue } from '../types';
export interface CodeAnalysis {
    score: number;
    issues: SecurityIssue[];
    suggestions: string[];
    complexity: 'low' | 'medium' | 'high';
    analysis: string;
}
export interface CodeContext {
    fileName?: string;
    project?: string;
    dependencies?: string[];
    framework?: string;
    targetAudience?: 'beginner' | 'intermediate' | 'advanced';
}
export interface CodeGenerationOptions {
    includeTests?: boolean;
    includeDocumentation?: boolean;
    codeStyle?: 'minimal' | 'verbose' | 'enterprise';
    maxTokens?: number;
}
export declare class CodingAgent {
    private aiService;
    private cache;
    private readonly supportedLanguages;
    constructor(aiService: AIService);
    generateCodeCompletion(code: string, language: string, context: string | CodeContext, options?: CodeGenerationOptions): Promise<CodeSuggestion>;
    suggestCodeImprovement(code: string, language: string, focus?: string[]): Promise<CodeSuggestion>;
    optimizeCode(code: string, language: string, targetMetric?: 'speed' | 'memory' | 'readability' | 'maintainability'): Promise<CodeSuggestion>;
    analyzeCode(code: string, language: string): Promise<CodeAnalysis>;
    generateTests(code: string, language: string, testFramework?: string): Promise<CodeSuggestion>;
    explainCode(code: string, language: string, level?: 'beginner' | 'intermediate' | 'advanced'): Promise<string>;
    private validateLanguage;
    private buildSystemPrompt;
    private formatContext;
    private getCacheKey;
    private hashCode;
    private calculateConfidence;
    private extractQualityScore;
    private extractIssues;
    private extractSuggestions;
    private assessComplexity;
    private getDefaultTestFramework;
    clearCache(): void;
    getCacheSize(): number;
}
//# sourceMappingURL=codingAgent.d.ts.map