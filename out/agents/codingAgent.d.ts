import { AIService } from '../services/aiService';
import { CodeSuggestion } from '../types';
export declare class CodingAgent {
    private aiService;
    constructor(aiService: AIService);
    generateCodeCompletion(code: string, language: string, context: string): Promise<CodeSuggestion>;
    suggestCodeImprovement(code: string, language: string): Promise<CodeSuggestion>;
    optimizeCode(code: string, language: string): Promise<CodeSuggestion>;
}
//# sourceMappingURL=codingAgent.d.ts.map