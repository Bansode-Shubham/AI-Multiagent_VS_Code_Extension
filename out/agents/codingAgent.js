"use strict";
// import { AIService } from '../services/aiService';
// import { ChatMessage, CodeSuggestion } from '../types';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodingAgent = void 0;
class CodingAgent {
    constructor(aiService) {
        this.cache = new Map();
        this.supportedLanguages = new Set([
            'typescript', 'javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust'
        ]);
        this.aiService = aiService;
    }
    async generateCodeCompletion(code, language, context, options = {}) {
        this.validateLanguage(language);
        const cacheKey = this.getCacheKey('completion', code, language, context);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        const contextStr = typeof context === 'string' ? context : this.formatContext(context);
        const systemPrompt = this.buildSystemPrompt(language, 'completion', options);
        const messages = [
            { role: 'system', content: systemPrompt },
            {
                role: 'user',
                content: `Context: ${contextStr}\n\nCurrent code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide a completion or improvement suggestion.`
            }
        ];
        const response = await this.aiService.chatWithGroq(messages);
        const suggestion = {
            type: 'completion',
            content: response,
            explanation: 'AI-generated code completion based on context and best practices'
        };
        this.cache.set(cacheKey, suggestion);
        return suggestion;
    }
    async suggestCodeImprovement(code, language, focus) {
        this.validateLanguage(language);
        const focusAreas = focus || ['performance', 'readability', 'maintainability', 'error handling'];
        const systemPrompt = `You are a code review expert. Analyze the code and suggest improvements for:
${focusAreas.map(area => `- ${area.charAt(0).toUpperCase() + area.slice(1)}`).join('\n')}

Provide specific, actionable suggestions with code examples where appropriate.`;
        const messages = [
            { role: 'system', content: systemPrompt },
            {
                role: 'user',
                content: `Language: ${language}\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide improvement suggestions with explanations.`
            }
        ];
        const response = await this.aiService.chatWithGroq(messages);
        return {
            type: 'improvement',
            content: response,
            explanation: `Code improvement suggestions focusing on: ${focusAreas.join(', ')}`
        };
    }
    async optimizeCode(code, language, targetMetric) {
        this.validateLanguage(language);
        const metric = targetMetric || 'speed';
        const systemPrompt = `You are a performance optimization expert specializing in ${language}. 
Focus on optimizing for ${metric} while maintaining functionality and code clarity.
Provide before/after comparisons and explain the performance impact.`;
        const messages = [
            { role: 'system', content: systemPrompt },
            {
                role: 'user',
                content: `Language: ${language}\nOptimization target: ${metric}\n\nCode to optimize:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide optimized version with explanations.`
            }
        ];
        const response = await this.aiService.chatWithGroq(messages);
        return {
            type: 'optimization',
            content: response,
            explanation: `Performance optimization suggestions targeting ${metric}`
        };
    }
    async analyzeCode(code, language) {
        this.validateLanguage(language);
        const systemPrompt = `Analyze the provided ${language} code and provide a comprehensive analysis including:
- Code quality score (1-10)
- Complexity assessment
- Potential bugs or issues
- Security concerns
- Best practices adherence
- Suggestions for improvement`;
        const messages = [
            { role: 'system', content: systemPrompt },
            {
                role: 'user',
                content: `Analyze this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide detailed analysis.`
            }
        ];
        const response = await this.aiService.chatWithGroq(messages);
        return {
            score: this.extractQualityScore(response),
            issues: this.extractIssues(response),
            suggestions: this.extractSuggestions(response),
            complexity: this.assessComplexity(code),
            analysis: response
        };
    }
    async generateTests(code, language, testFramework) {
        this.validateLanguage(language);
        const framework = testFramework || this.getDefaultTestFramework(language);
        const systemPrompt = `Generate comprehensive unit tests for the provided ${language} code using ${framework}.
Include edge cases, error scenarios, and proper test structure.`;
        const messages = [
            { role: 'system', content: systemPrompt },
            {
                role: 'user',
                content: `Generate tests for this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nUse ${framework} framework.`
            }
        ];
        const response = await this.aiService.chatWithGroq(messages);
        return {
            type: 'completion',
            content: response,
            explanation: `Unit tests generated using ${framework}`
        };
    }
    async explainCode(code, language, level = 'intermediate') {
        this.validateLanguage(language);
        const systemPrompt = `Explain the provided ${language} code for a ${level} developer.
${level === 'beginner' ? 'Use simple language and explain basic concepts.' : ''}
${level === 'advanced' ? 'Focus on advanced patterns, optimizations, and architectural decisions.' : ''}
Break down complex parts and explain the overall logic flow.`;
        const messages = [
            { role: 'system', content: systemPrompt },
            {
                role: 'user',
                content: `Explain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nTarget audience: ${level}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    validateLanguage(language) {
        if (!this.supportedLanguages.has(language.toLowerCase())) {
            throw new Error(`Unsupported language: ${language}`);
        }
    }
    buildSystemPrompt(language, type, options) {
        const basePrompt = `You are a coding assistant specializing in ${language}. `;
        switch (type) {
            case 'completion':
                return basePrompt + `Provide code completions and improvements. Focus on:
- Clean, efficient code
- Best practices for ${language}
- Performance optimization
- Readability and maintainability
${options.includeTests ? '- Include relevant tests' : ''}
${options.includeDocumentation ? '- Include documentation' : ''}`;
            default:
                return basePrompt;
        }
    }
    formatContext(context) {
        return Object.entries(context)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
    }
    getCacheKey(type, code, language, context) {
        const contextStr = typeof context === 'string' ? context : JSON.stringify(context);
        return `${type}-${language}-${this.hashCode(code + contextStr)}`;
    }
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    calculateConfidence(code, response) {
        // Simple confidence calculation based on code length and response quality
        const codeLength = code.length;
        const responseLength = response.length;
        if (codeLength === 0)
            return 0.5;
        if (responseLength === 0)
            return 0.1;
        const ratio = Math.min(responseLength / codeLength, 3);
        return Math.max(0.3, Math.min(0.95, ratio * 0.3 + 0.4));
    }
    extractQualityScore(analysis) {
        const scoreMatch = analysis.match(/score[:\s]*(\d+(?:\.\d+)?)/i);
        return scoreMatch ? parseFloat(scoreMatch[1]) : 7;
    }
    extractIssues(analysis) {
        // Simple extraction - in practice, you'd want more sophisticated parsing
        const issueSection = analysis.match(/issues?[:\s]*\n(.*?)(?=\n\n|\n[A-Z]|$)/is);
        if (!issueSection)
            return [];
        const issueLines = issueSection[1].split('\n').filter(line => line.trim());
        return issueLines.map((line, index) => ({
            type: 'general',
            severity: 'medium',
            line: index + 1,
            message: line.trim(),
            suggestion: 'Review and address this issue'
        }));
    }
    extractSuggestions(analysis) {
        const suggestionSection = analysis.match(/suggestions?[:\s]*\n(.*?)(?=\n\n|\n[A-Z]|$)/is);
        return suggestionSection ? suggestionSection[1].split('\n').filter(line => line.trim()) : [];
    }
    assessComplexity(code) {
        const lines = code.split('\n').length;
        const cyclomaticIndicators = (code.match(/\b(if|for|while|switch|catch|&&|\|\|)\b/g) || []).length;
        if (lines < 20 && cyclomaticIndicators < 3)
            return 'low';
        if (lines < 50 && cyclomaticIndicators < 8)
            return 'medium';
        return 'high';
    }
    getDefaultTestFramework(language) {
        const frameworks = {
            javascript: 'Jest',
            typescript: 'Jest',
            python: 'pytest',
            java: 'JUnit',
            csharp: 'xUnit',
            go: 'testing',
            rust: 'built-in'
        };
        return frameworks[language.toLowerCase()] || 'framework-appropriate';
    }
    clearCache() {
        this.cache.clear();
    }
    getCacheSize() {
        return this.cache.size;
    }
}
exports.CodingAgent = CodingAgent;
//# sourceMappingURL=codingAgent.js.map