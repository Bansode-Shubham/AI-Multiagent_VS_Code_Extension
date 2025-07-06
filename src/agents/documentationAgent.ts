// import { AIService } from '../services/aiService';
// import { ChatMessage } from '../types';

// export class DocumentationAgent {
//   private aiService: AIService;

//   constructor(aiService: AIService) {
//     this.aiService = aiService;
//   }

//   async generateCodeDocumentation(code: string, language: string): Promise<string> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are a technical documentation expert. Generate comprehensive documentation including:
//         - Function/class descriptions
//         - Parameter explanations
//         - Return value descriptions
//         - Usage examples
//         - Edge cases and error handling`
//       },
//       {
//         role: 'user',
//         content: `Language: ${language}\n\nCode to document:\n${code}`
//       }
//     ];

//     return await this.aiService.chatWithGroq(messages);
//   }

//   async generateErrorResolutionDocs(error: string, code: string, language: string): Promise<string> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are an error resolution expert. Create detailed documentation for error fixes including:
//         - Error explanation
//         - Root cause analysis
//         - Step-by-step resolution
//         - Prevention strategies
//         - Related resources`
//       },
//       {
//         role: 'user',
//         content: `Error: ${error}\nLanguage: ${language}\nCode context:\n${code}`
//       }
//     ];

//     return await this.aiService.chatWithDeepSeekR1(messages).then(response => 
//       response.choices[0]?.message?.content || ""
//     );
//   }

//   async generateAPIDocumentation(code: string, language: string): Promise<string> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are an API documentation specialist. Generate comprehensive API documentation with:
//         - Endpoint descriptions
//         - Request/response formats
//         - Authentication requirements
//         - Error codes and handling
//         - Usage examples`
//       },
//       {
//         role: 'user',
//         content: `Language: ${language}\n\nAPI code:\n${code}`
//       }
//     ];

//     return await this.aiService.chatWithGroq(messages);
//   }

//   async generateTroubleshootingGuide(issue: string, context: string): Promise<string> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are a troubleshooting expert. Create a comprehensive troubleshooting guide with:
//         - Problem identification
//         - Diagnostic steps
//         - Common solutions
//         - Advanced troubleshooting
//         - Prevention measures`
//       },
//       {
//         role: 'user',
//         content: `Issue: ${issue}\nContext: ${context}`
//       }
//     ];

//     return await this.aiService.chatWithGroq(messages);
//   }
// }

import { AIService } from '../services/aiService';
import { ChatMessage } from '../types';

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

export class DocumentationAgent {
  private aiService: AIService;
  private defaultConfig: DocumentationConfig;

  constructor(aiService: AIService, config: DocumentationConfig = {}) {
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

  async generateCodeDocumentation(
    code: string, 
    language: string, 
    config: DocumentationConfig = {}
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const messages: ChatMessage[] = [
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

  async generateErrorResolutionDocs(
    error: string, 
    code: string, 
    language: string,
    config: DocumentationConfig = {}
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: this.buildDocumentationPrompt(finalConfig, 'error')
      },
      {
        role: 'user',
        content: `Error: ${error}\nLanguage: ${language}\nCode context:\n${code}`
      }
    ];

    return await this.aiService.chatWithDeepSeekR1(messages).then(response => 
      response.choices[0]?.message?.content || ""
    );
  }

  async generateAPIDocumentation(
    code: string, 
    language: string,
    config: DocumentationConfig = {}
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const messages: ChatMessage[] = [
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

  async generateTroubleshootingGuide(
    issue: string, 
    context: string,
    config: DocumentationConfig = {}
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const messages: ChatMessage[] = [
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

  async analyzeCodeQuality(code: string, language: string): Promise<CodeAnalysis> {
    const messages: ChatMessage[] = [
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
    } catch {
      return {
        complexity: 5,
        maintainability: 5,
        testability: 5,
        suggestions: ['Unable to analyze code quality']
      };
    }
  }

  async generateArchitecturalDocs(
    codebase: string[], 
    projectName: string,
    config: DocumentationConfig = {}
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const messages: ChatMessage[] = [
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

  async generateTestingDocs(
    code: string, 
    language: string,
    config: DocumentationConfig = {}
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const messages: ChatMessage[] = [
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

  async generateChangeLog(
    oldCode: string, 
    newCode: string, 
    language: string
  ): Promise<string> {
    const messages: ChatMessage[] = [
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

  async generateSecurityDocs(
    code: string, 
    language: string,
    config: DocumentationConfig = {}
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const messages: ChatMessage[] = [
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

  async generatePerformanceDocs(
    code: string, 
    language: string,
    config: DocumentationConfig = {}
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const messages: ChatMessage[] = [
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

  async generateComprehensiveDocs(
    code: string, 
    language: string, 
    projectName: string,
    config: DocumentationConfig = {}
  ): Promise<{
    codeDocumentation: string;
    apiDocumentation: string;
    testingDocs: string;
    securityDocs: string;
    performanceDocs: string;
    qualityAnalysis: CodeAnalysis;
  }> {
    const [
      codeDocumentation,
      apiDocumentation,
      testingDocs,
      securityDocs,
      performanceDocs,
      qualityAnalysis
    ] = await Promise.all([
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

  private buildDocumentationPrompt(config: DocumentationConfig, type: string): string {
    const basePrompts: Record<string, string> = {
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

  setDefaultConfig(config: DocumentationConfig): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }
}