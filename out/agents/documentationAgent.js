"use strict";
// import { AIService } from '../services/aiService';
// import { ChatMessage } from '../types';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationAgent = void 0;
class DocumentationAgent {
    constructor(aiService, config = {}) {
        this.aiService = aiService;
        this.defaultConfig = {
            includeExamples: true,
            includeTesting: true,
            includePerformance: false,
            outputFormat: 'markdown',
            detailLevel: 'detailed',
            ...config
        };
    }
    async generateCodeDocumentation(code, language, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        const messages = [
            {
                role: 'system',
                content: this.buildDocumentationPrompt(finalConfig, 'code')
            },
            {
                role: 'user',
                content: `Language: ${language}\n\nCode to document:\n${code}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    async generateErrorResolutionDocs(error, code, language, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        const messages = [
            {
                role: 'system',
                content: this.buildDocumentationPrompt(finalConfig, 'error')
            },
            {
                role: 'user',
                content: `Error: ${error}\nLanguage: ${language}\nCode context:\n${code}`
            }
        ];
        return await this.aiService.chatWithDeepSeekR1(messages).then(response => response.choices[0]?.message?.content || "");
    }
    async generateAPIDocumentation(code, language, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        const messages = [
            {
                role: 'system',
                content: this.buildDocumentationPrompt(finalConfig, 'api')
            },
            {
                role: 'user',
                content: `Language: ${language}\n\nAPI code:\n${code}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    async generateTroubleshootingGuide(issue, context, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        const messages = [
            {
                role: 'system',
                content: this.buildDocumentationPrompt(finalConfig, 'troubleshooting')
            },
            {
                role: 'user',
                content: `Issue: ${issue}\nContext: ${context}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    async analyzeCodeQuality(code, language) {
        const messages = [
            {
                role: 'system',
                content: `You are a code quality analyst. Analyze the provided code and return a JSON object with:
        - complexity: number (1-10 scale)
        - maintainability: number (1-10 scale)
        - testability: number (1-10 scale)
        - suggestions: array of improvement suggestions`
            },
            {
                role: 'user',
                content: `Language: ${language}\n\nCode:\n${code}`
            }
        ];
        const response = await this.aiService.chatWithGroq(messages);
        try {
            return JSON.parse(response);
        }
        catch {
            return {
                complexity: 5,
                maintainability: 5,
                testability: 5,
                suggestions: ['Unable to analyze code quality']
            };
        }
    }
    async generateArchitecturalDocs(codebase, projectName, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        const messages = [
            {
                role: 'system',
                content: `You are a software architect. Generate comprehensive architectural documentation including:
        - System overview and purpose
        - Component architecture
        - Data flow diagrams
        - Technology stack
        - Design patterns used
        - Security considerations
        - Scalability aspects
        - Integration points
        Output format: ${finalConfig.outputFormat}`
            },
            {
                role: 'user',
                content: `Project: ${projectName}\n\nCodebase files:\n${codebase.join('\n\n---\n\n')}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    async generateTestingDocs(code, language, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        const messages = [
            {
                role: 'system',
                content: `You are a testing specialist. Generate comprehensive testing documentation including:
        - Test strategy
        - Unit test examples
        - Integration test scenarios
        - Edge cases to test
        - Mocking strategies
        - Test data requirements
        - Coverage recommendations
        Output format: ${finalConfig.outputFormat}`
            },
            {
                role: 'user',
                content: `Language: ${language}\n\nCode:\n${code}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    async generateChangeLog(oldCode, newCode, language) {
        const messages = [
            {
                role: 'system',
                content: `You are a change documentation specialist. Compare the old and new code versions and generate a detailed changelog with:
        - Summary of changes
        - Added features
        - Modified functionality
        - Removed features
        - Breaking changes
        - Migration notes
        - Impact assessment`
            },
            {
                role: 'user',
                content: `Language: ${language}\n\nOld code:\n${oldCode}\n\nNew code:\n${newCode}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    async generateSecurityDocs(code, language, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        const messages = [
            {
                role: 'system',
                content: `You are a security documentation expert. Analyze the code for security considerations and generate documentation including:
        - Security vulnerabilities
        - Input validation requirements
        - Authentication/authorization
        - Data protection measures
        - Security best practices
        - Compliance considerations
        - Threat model
        Output format: ${finalConfig.outputFormat}`
            },
            {
                role: 'user',
                content: `Language: ${language}\n\nCode:\n${code}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    async generatePerformanceDocs(code, language, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        const messages = [
            {
                role: 'system',
                content: `You are a performance documentation specialist. Analyze the code and generate performance documentation including:
        - Performance characteristics
        - Time/space complexity
        - Bottleneck identification
        - Optimization opportunities
        - Monitoring recommendations
        - Benchmarking strategies
        - Scalability considerations
        Output format: ${finalConfig.outputFormat}`
            },
            {
                role: 'user',
                content: `Language: ${language}\n\nCode:\n${code}`
            }
        ];
        return await this.aiService.chatWithGroq(messages);
    }
    async generateComprehensiveDocs(code, language, projectName, config = {}) {
        const [codeDocumentation, apiDocumentation, testingDocs, securityDocs, performanceDocs, qualityAnalysis] = await Promise.all([
            this.generateCodeDocumentation(code, language, config),
            this.generateAPIDocumentation(code, language, config),
            this.generateTestingDocs(code, language, config),
            this.generateSecurityDocs(code, language, config),
            this.generatePerformanceDocs(code, language, config),
            this.analyzeCodeQuality(code, language)
        ]);
        return {
            codeDocumentation,
            apiDocumentation,
            testingDocs,
            securityDocs,
            performanceDocs,
            qualityAnalysis
        };
    }
    buildDocumentationPrompt(config, type) {
        const basePrompts = {
            code: `You are a technical documentation expert. Generate comprehensive code documentation including:
      - Function/class descriptions
      - Parameter explanations
      - Return value descriptions
      - Usage examples
      - Edge cases and error handling`,
            error: `You are an error resolution expert. Create detailed documentation for error fixes including:
      - Error explanation
      - Root cause analysis
      - Step-by-step resolution
      - Prevention strategies
      - Related resources`,
            api: `You are an API documentation specialist. Generate comprehensive API documentation with:
      - Endpoint descriptions
      - Request/response formats
      - Authentication requirements
      - Error codes and handling
      - Usage examples`,
            troubleshooting: `You are a troubleshooting expert. Create a comprehensive troubleshooting guide with:
      - Problem identification
      - Diagnostic steps
      - Common solutions
      - Advanced troubleshooting
      - Prevention measures`
        };
        let prompt = basePrompts[type] || basePrompts.code;
        if (config.includeTesting) {
            prompt += '\n- Testing strategies and examples';
        }
        if (config.includePerformance) {
            prompt += '\n- Performance considerations';
        }
        prompt += `\n\nOutput format: ${config.outputFormat}`;
        prompt += `\nDetail level: ${config.detailLevel}`;
        if (!config.includeExamples) {
            prompt += '\nSkip usage examples.';
        }
        return prompt;
    }
    setDefaultConfig(config) {
        this.defaultConfig = { ...this.defaultConfig, ...config };
    }
}
exports.DocumentationAgent = DocumentationAgent;
//# sourceMappingURL=documentationAgent.js.map