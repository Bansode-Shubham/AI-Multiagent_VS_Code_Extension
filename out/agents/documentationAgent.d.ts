import { AIService } from '../services/aiService';
export declare class DocumentationAgent {
    private aiService;
    constructor(aiService: AIService);
    generateCodeDocumentation(code: string, language: string): Promise<string>;
    generateErrorResolutionDocs(error: string, code: string, language: string): Promise<string>;
    generateAPIDocumentation(code: string, language: string): Promise<string>;
    generateTroubleshootingGuide(issue: string, context: string): Promise<string>;
}
//# sourceMappingURL=documentationAgent.d.ts.map