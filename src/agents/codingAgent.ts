// import { AIService } from '../services/aiService';
// import { ChatMessage, CodeSuggestion } from '../types';

// export class CodingAgent {
//   private aiService: AIService;

//   constructor(aiService: AIService) {
//     this.aiService = aiService;
//   }

//   async generateCodeCompletion(code: string, language: string, context: string): Promise<CodeSuggestion> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are a coding assistant specializing in ${language}. Provide code completions and improvements. Focus on:
//         - Clean, efficient code
//         - Best practices
//         - Performance optimization
//         - Readability`
//       },
//       {
//         role: 'user',
//         content: `Context: ${context}\n\nCurrent code:\n${code}\n\nProvide a completion or improvement suggestion.`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     return {
//       type: 'completion',
//       content: response,
//       explanation: 'AI-generated code completion based on context and best practices'
//     };
//   }

//   async suggestCodeImprovement(code: string, language: string): Promise<CodeSuggestion> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are a code review expert. Analyze the code and suggest improvements for:
//         - Performance
//         - Readability
//         - Maintainability
//         - Error handling`
//       },
//       {
//         role: 'user',
//         content: `Language: ${language}\n\nCode to review:\n${code}`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     return {
//       type: 'improvement',
//       content: response,
//       explanation: 'Code improvement suggestions based on best practices'
//     };
//   }

//   async optimizeCode(code: string, language: string): Promise<CodeSuggestion> {
//     const messages: ChatMessage[] = [
//       {
//         role: 'system',
//         content: `You are a performance optimization expert. Analyze the code and suggest optimizations while maintaining functionality.`
//       },
//       {
//         role: 'user',
//         content: `Language: ${language}\n\nCode to optimize:\n${code}`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     return {
//       type: 'optimization',
//       content: response,
//       explanation: 'Performance optimization suggestions'
//     };
//   }
// }



// import { AIService } from '../services/aiService';
// import { ChatMessage, CodeSuggestion, SecurityIssue } from '../types';

// export interface CodeAnalysis {
//   score: number;
//   issues: SecurityIssue[];
//   suggestions: string[];
//   complexity: 'low' | 'medium' | 'high';
//   analysis: string;


// }

// export interface CodeContext {
//   fileName?: string;
//   project?: string;
//   dependencies?: string[];
//   framework?: string;
//   targetAudience?: 'beginner' | 'intermediate' | 'advanced';
// }

// export interface CodeGenerationOptions {
//   includeTests?: boolean;
//   includeDocumentation?: boolean;
//   codeStyle?: 'minimal' | 'verbose' | 'enterprise';
//   maxTokens?: number;
// }

// export class CodingAgent {
//   private aiService: AIService;
//   private cache = new Map<string, CodeSuggestion>();
//   private readonly supportedLanguages = new Set([
//     'typescript', 'javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust'
//   ]);

//   constructor(aiService: AIService) {
//     this.aiService = aiService;
//   }

//   async generateCodeCompletion(
//     code: string, 
//     language: string, 
//     context: string | CodeContext,
//     options: CodeGenerationOptions = {}
//   ): Promise<CodeSuggestion> {
//     this.validateLanguage(language);
    
//     const cacheKey = this.getCacheKey('completion', code, language, context);
//     if (this.cache.has(cacheKey)) {
//       return this.cache.get(cacheKey)!;
//     }

//     const contextStr = typeof context === 'string' ? context : this.formatContext(context);
//     const systemPrompt = this.buildSystemPrompt(language, 'completion', options);
    
//     const messages: ChatMessage[] = [
//       { role: 'system', content: systemPrompt },
//       {
//         role: 'user',
//         content: `Context: ${contextStr}\n\nCurrent code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide a completion or improvement suggestion.`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     const suggestion: CodeSuggestion = {
//       type: 'completion',
//       content: response,
//       explanation: 'AI-generated code completion based on context and best practices'
//     };

//     this.cache.set(cacheKey, suggestion);
//     return suggestion;
//   }

//   async suggestCodeImprovement(
//     code: string, 
//     language: string,
//     focus?: string[]
//   ): Promise<CodeSuggestion> {
//     this.validateLanguage(language);
    
//     const focusAreas = focus || ['performance', 'readability', 'maintainability', 'error handling'];
//     const systemPrompt = `You are a code review expert. Analyze the code and suggest improvements for:
// ${focusAreas.map(area => `- ${area.charAt(0).toUpperCase() + area.slice(1)}`).join('\n')}

// Provide specific, actionable suggestions with code examples where appropriate.`;

//     const messages: ChatMessage[] = [
//       { role: 'system', content: systemPrompt },
//       {
//         role: 'user',
//         content: `Language: ${language}\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide improvement suggestions with explanations.`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     return {
//       type: 'improvement',
//       content: response,
//       explanation: `Code improvement suggestions focusing on: ${focusAreas.join(', ')}`
//     };
//   }

//   async optimizeCode(
//     code: string, 
//     language: string,
//     targetMetric?: 'speed' | 'memory' | 'readability' | 'maintainability'
//   ): Promise<CodeSuggestion> {
//     this.validateLanguage(language);
    
//     const metric = targetMetric || 'speed';
//     const systemPrompt = `You are a performance optimization expert specializing in ${language}. 
// Focus on optimizing for ${metric} while maintaining functionality and code clarity.
// Provide before/after comparisons and explain the performance impact.`;

//     const messages: ChatMessage[] = [
//       { role: 'system', content: systemPrompt },
//       {
//         role: 'user',
//         content: `Language: ${language}\nOptimization target: ${metric}\n\nCode to optimize:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide optimized version with explanations.`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     return {
//       type: 'optimization',
//       content: response,
//       explanation: `Performance optimization suggestions targeting ${metric}`
//     };
//   }

//   async analyzeCode(code: string, language: string): Promise<CodeAnalysis> {
//     this.validateLanguage(language);
    
//     const systemPrompt = `Analyze the provided ${language} code and provide a comprehensive analysis including:
// - Code quality score (1-10)
// - Complexity assessment
// - Potential bugs or issues
// - Security concerns
// - Best practices adherence
// - Suggestions for improvement`;

//     const messages: ChatMessage[] = [
//       { role: 'system', content: systemPrompt },
//       {
//         role: 'user',
//         content: `Analyze this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide detailed analysis.`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     return {
//       score: this.extractQualityScore(response),
//       issues: this.extractIssues(response),
//       suggestions: this.extractSuggestions(response),
//       complexity: this.assessComplexity(code),
//       analysis: response
//     };
//   }

//   async generateTests(
//     code: string, 
//     language: string,
//     testFramework?: string
//   ): Promise<CodeSuggestion> {
//     this.validateLanguage(language);
    
//     const framework = testFramework || this.getDefaultTestFramework(language);
//     const systemPrompt = `Generate comprehensive unit tests for the provided ${language} code using ${framework}.
// Include edge cases, error scenarios, and proper test structure.`;

//     const messages: ChatMessage[] = [
//       { role: 'system', content: systemPrompt },
//       {
//         role: 'user',
//         content: `Generate tests for this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nUse ${framework} framework.`
//       }
//     ];

//     const response = await this.aiService.chatWithGroq(messages);
    
//     return {
//       type: 'completion',
//       content: response,
//       explanation: `Unit tests generated using ${framework}`
//     };
//   }

//   async explainCode(code: string, language: string, level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<string> {
//     this.validateLanguage(language);
    
//     const systemPrompt = `Explain the provided ${language} code for a ${level} developer.
// ${level === 'beginner' ? 'Use simple language and explain basic concepts.' : ''}
// ${level === 'advanced' ? 'Focus on advanced patterns, optimizations, and architectural decisions.' : ''}
// Break down complex parts and explain the overall logic flow.`;

//     const messages: ChatMessage[] = [
//       { role: 'system', content: systemPrompt },
//       {
//         role: 'user',
//         content: `Explain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nTarget audience: ${level}`
//       }
//     ];

//     return await this.aiService.chatWithGroq(messages);
//   }

//   private validateLanguage(language: string): void {
//     if (!this.supportedLanguages.has(language.toLowerCase())) {
//       throw new Error(`Unsupported language: ${language}`);
//     }
//   }

//   private buildSystemPrompt(language: string, type: string, options: CodeGenerationOptions): string {
//     const basePrompt = `You are a coding assistant specializing in ${language}. `;
    
//     switch (type) {
//       case 'completion':
//         return basePrompt + `Provide code completions and improvements. Focus on:
// - Clean, efficient code
// - Best practices for ${language}
// - Performance optimization
// - Readability and maintainability
// ${options.includeTests ? '- Include relevant tests' : ''}
// ${options.includeDocumentation ? '- Include documentation' : ''}`;
//       default:
//         return basePrompt;
//     }
//   }

//   private formatContext(context: CodeContext): string {
//     return Object.entries(context)
//       .filter(([_, value]) => value !== undefined)
//       .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
//       .join('\n');
//   }

//   private getCacheKey(type: string, code: string, language: string, context: string | CodeContext): string {
//     const contextStr = typeof context === 'string' ? context : JSON.stringify(context);
//     return `${type}-${language}-${this.hashCode(code + contextStr)}`;
//   }

//   private hashCode(str: string): number {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       const char = str.charCodeAt(i);
//       hash = ((hash << 5) - hash) + char;
//       hash = hash & hash; // Convert to 32-bit integer
//     }
//     return hash;
//   }

//   private calculateConfidence(code: string, response: string): number {
//     // Simple confidence calculation based on code length and response quality
//     const codeLength = code.length;
//     const responseLength = response.length;
    
//     if (codeLength === 0) return 0.5;
//     if (responseLength === 0) return 0.1;
    
//     const ratio = Math.min(responseLength / codeLength, 3);
//     return Math.max(0.3, Math.min(0.95, ratio * 0.3 + 0.4));
//   }

//   private extractQualityScore(analysis: string): number {
//     const scoreMatch = analysis.match(/score[:\s]*(\d+(?:\.\d+)?)/i);
//     return scoreMatch ? parseFloat(scoreMatch[1]) : 7;
//   }

//   private extractIssues(analysis: string): SecurityIssue[] {
//     // Simple extraction - in practice, you'd want more sophisticated parsing
//     const issueSection = analysis.match(/issues?[:\s]*\n(.*?)(?=\n\n|\n[A-Z]|$)/is);
//     if (!issueSection) return [];
    
//     const issueLines = issueSection[1].split('\n').filter(line => line.trim());
//     return issueLines.map((line, index) => ({
//       type: 'general',
//       severity: 'medium' as const,
//       line: index + 1,
//       message: line.trim(),
//       suggestion: 'Review and address this issue'
//     }));
//   }

//   private extractSuggestions(analysis: string): string[] {
//     const suggestionSection = analysis.match(/suggestions?[:\s]*\n(.*?)(?=\n\n|\n[A-Z]|$)/is);
//     return suggestionSection ? suggestionSection[1].split('\n').filter(line => line.trim()) : [];
//   }

//   private assessComplexity(code: string): 'low' | 'medium' | 'high' {
//     const lines = code.split('\n').length;
//     const cyclomaticIndicators = (code.match(/\b(if|for|while|switch|catch|&&|\|\|)\b/g) || []).length;
    
//     if (lines < 20 && cyclomaticIndicators < 3) return 'low';
//     if (lines < 50 && cyclomaticIndicators < 8) return 'medium';
//     return 'high';
//   }

//   private getDefaultTestFramework(language: string): string {
//     const frameworks: Record<string, string> = {
//       javascript: 'Jest',
//       typescript: 'Jest',
//       python: 'pytest',
//       java: 'JUnit',
//       csharp: 'xUnit',
//       go: 'testing',
//       rust: 'built-in'
//     };
//     return frameworks[language.toLowerCase()] || 'framework-appropriate';
//   }

//   clearCache(): void {
//     this.cache.clear();
//   }

//   getCacheSize(): number {
//     return this.cache.size;
//   }
// }


import { AIService } from '../services/aiService';
import { ChatMessage, CodeSuggestion, SecurityIssue } from '../types';

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
export interface CodeExplanationOptions {
  includeFlowDiagram?: boolean;
  includeExamples?: boolean;
  focusAreas?: string[];
  outputFormat?: 'html'| 'markdown' | 'plain'  ;
}

export class CodingAgent {
  private aiService: AIService;
  private cache = new Map<string, CodeSuggestion>();
  private readonly supportedLanguages = new Set([
    'typescript', 'javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust'
  ]);

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async generateCodeCompletion(
    code: string, 
    language: string, 
    context: string | CodeContext,
    options: CodeGenerationOptions = {}
  ): Promise<CodeSuggestion> {
    this.validateLanguage(language);
    
    const cacheKey = this.getCacheKey('completion', code, language, context);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const contextStr = typeof context === 'string' ? context : this.formatContext(context);
    const systemPrompt = this.buildSystemPrompt(language, 'completion', options);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Context: ${contextStr}\n\nCurrent code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide a completion or improvement suggestion.`
      }
    ];

    const response = await this.aiService.chatWithGroq(messages);
    
    const suggestion: CodeSuggestion = {
      type: 'completion',
      content: response,
      explanation: 'AI-generated code completion based on context and best practices'
    };

    this.cache.set(cacheKey, suggestion);
    return suggestion;
  }

  async suggestCodeImprovement(
    code: string, 
    language: string,
    focus?: string[]
  ): Promise<CodeSuggestion> {
    this.validateLanguage(language);
    
    const focusAreas = focus || ['performance', 'readability', 'maintainability', 'error handling'];
    const systemPrompt = `You are a code review expert. Analyze the code and suggest improvements for:
${focusAreas.map(area => `- ${area.charAt(0).toUpperCase() + area.slice(1)}`).join('\n')}

Provide specific, actionable suggestions with code examples where appropriate.`;

    const messages: ChatMessage[] = [
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

  async optimizeCode(
    code: string, 
    language: string,
    targetMetric?: 'speed' | 'memory' | 'readability' | 'maintainability'
  ): Promise<CodeSuggestion> {
    this.validateLanguage(language);
    
    const metric = targetMetric || 'speed';
    const systemPrompt = `You are a performance optimization expert specializing in ${language}. 
Focus on optimizing for ${metric} while maintaining functionality and code clarity.
Provide before/after comparisons and explain the performance impact.`;

    const messages: ChatMessage[] = [
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

  async analyzeCode(code: string, language: string): Promise<CodeAnalysis> {
    this.validateLanguage(language);
    
    const systemPrompt = `Analyze the provided ${language} code and provide a comprehensive analysis including:
- Code quality score (1-10)
- Complexity assessment
- Potential bugs or issues
- Security concerns
- Best practices adherence
- Suggestions for improvement`;

    const messages: ChatMessage[] = [
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

  async generateTests(
    code: string, 
    language: string,
    testFramework?: string
  ): Promise<CodeSuggestion> {
    this.validateLanguage(language);
    
    const framework = testFramework || this.getDefaultTestFramework(language);
    const systemPrompt = `Generate comprehensive unit tests for the provided ${language} code using ${framework}.
Include edge cases, error scenarios, and proper test structure.`;

    const messages: ChatMessage[] = [
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

  async explainCode(
    code: string, 
    language: string, 
    level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
    options: CodeExplanationOptions = {}
  ): Promise<string> {
    this.validateLanguage(language);
    
    const cacheKey = this.getCacheKey('explanation', code, language, `${level}-${JSON.stringify(options)}`);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!.content;
    }

    const systemPrompt = this.buildExplanationPrompt(language, level, options);
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: this.buildExplanationUserPrompt(code, language, level, options)
      }
    ];

    const response = await this.aiService.chatWithGroq(messages);
    
    // Cache the explanation
    this.cache.set(cacheKey, {
      type: 'explanation',
      content: response,
      explanation: `Code explanation for ${level} level`
    });
    
    return response;
  }

  async explainCodeSection(
    code: string,
    language: string,
    startLine: number,
    endLine: number,
    level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<string> {
    this.validateLanguage(language);
    
    const lines = code.split('\n');
    const section = lines.slice(startLine - 1, endLine).join('\n');
    
    const systemPrompt = `Explain the specific section of ${language} code for a ${level} developer.
Focus on this particular code section and its role in the overall context.
${level === 'beginner' ? 'Use simple language and explain basic concepts.' : ''}
${level === 'advanced' ? 'Focus on advanced patterns and implementation details.' : ''}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Full code context:\n\`\`\`${language}\n${code}\n\`\`\`\n\nExplain lines ${startLine}-${endLine}:\n\`\`\`${language}\n${section}\n\`\`\`\n\nTarget audience: ${level}`
      }
    ];

    return await this.aiService.chatWithGroq(messages);
  }

  async explainCodePattern(
    code: string,
    language: string,
    patternName: string,
    level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<string> {
    this.validateLanguage(language);
    
    const systemPrompt = `Explain the ${patternName} pattern as implemented in the provided ${language} code.
Target audience: ${level} developers.
Focus on:
- How the pattern is implemented
- Why this pattern is used
- Benefits and trade-offs
- Alternative approaches
${level === 'beginner' ? 'Use simple explanations with examples.' : ''}
${level === 'advanced' ? 'Include implementation details and optimization considerations.' : ''}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Analyze the ${patternName} pattern in this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nExplain for ${level} level.`
      }
    ];

    return await this.aiService.chatWithGroq(messages);
  }

  private buildExplanationPrompt(
    language: string, 
    level: 'beginner' | 'intermediate' | 'advanced',
    options: CodeExplanationOptions
  ): string {
    let prompt = `You are an expert ${language} developer and teacher. Explain the provided code for a ${level} developer.`;
    
    switch (level) {
      case 'beginner':
        prompt += `\n- Use simple, clear language
- Explain basic concepts and terminology
- Break down complex parts step by step
- Include analogies when helpful
- Avoid jargon or explain it when necessary`;
        break;
      case 'intermediate':
        prompt += `\n- Assume familiarity with basic concepts
- Focus on patterns, architecture, and design decisions
- Explain the reasoning behind code structure
- Highlight best practices and potential improvements`;
        break;
      case 'advanced':
        prompt += `\n- Focus on advanced patterns and optimizations
- Discuss architectural implications
- Analyze performance considerations
- Explain trade-offs and alternative approaches
- Include implementation details and edge cases`;
        break;
    }

    if (options.focusAreas && options.focusAreas.length > 0) {
      prompt += `\n\nFocus specifically on these areas: ${options.focusAreas.join(', ')}`;
    }

    if (options.includeFlowDiagram) {
      prompt += `\n- Include a text-based flow diagram showing the execution flow`;
    }

    if (options.includeExamples) {
      prompt += `\n- Provide practical examples of how this code would be used`;
    }

    const formatInstructions = this.getFormatInstructions(options.outputFormat);
    if (formatInstructions) {
      prompt += `\n\n${formatInstructions}`;
    }

    return prompt;
  }

  private buildExplanationUserPrompt(
    code: string,
    language: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    options: CodeExplanationOptions
  ): string {
    let prompt = `Explain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;
    
    prompt += `\n\nTarget audience: ${level} developers`;
    
    if (options.focusAreas && options.focusAreas.length > 0) {
      prompt += `\nFocus on: ${options.focusAreas.join(', ')}`;
    }

    return prompt;
  }

  private getFormatInstructions(format?: 'markdown' | 'plain' | 'html'): string | null {
    switch (format) {
      case 'markdown':
        return 'Format the response using Markdown with proper headings, code blocks, and emphasis.';
      case 'html':
        return 'Format the response using HTML with proper semantic tags and code highlighting.';
      case 'plain':
        return 'Use plain text format without special formatting.';
      default:
        return null;
    }
  }

  private validateLanguage(language: string): void {
    if (!this.supportedLanguages.has(language.toLowerCase())) {
      throw new Error(`Unsupported language: ${language}`);
    }
  }

  private buildSystemPrompt(language: string, type: string, options: CodeGenerationOptions): string {
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

  private formatContext(context: CodeContext): string {
    return Object.entries(context)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join('\n');
  }

  private getCacheKey(type: string, code: string, language: string, context: string | CodeContext): string {
    const contextStr = typeof context === 'string' ? context : JSON.stringify(context);
    return `${type}-${language}-${this.hashCode(code + contextStr)}`;
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  private calculateConfidence(code: string, response: string): number {
    // Simple confidence calculation based on code length and response quality
    const codeLength = code.length;
    const responseLength = response.length;
    
    if (codeLength === 0) return 0.5;
    if (responseLength === 0) return 0.1;
    
    const ratio = Math.min(responseLength / codeLength, 3);
    return Math.max(0.3, Math.min(0.95, ratio * 0.3 + 0.4));
  }

  private extractQualityScore(analysis: string): number {
    const scoreMatch = analysis.match(/score[:\s]*(\d+(?:\.\d+)?)/i);
    return scoreMatch ? parseFloat(scoreMatch[1]) : 7;
  }

  private extractIssues(analysis: string): SecurityIssue[] {
    // Simple extraction - in practice, you'd want more sophisticated parsing
    const issueSection = analysis.match(/issues?[:\s]*\n(.*?)(?=\n\n|\n[A-Z]|$)/is);
    if (!issueSection) return [];
    
    const issueLines = issueSection[1].split('\n').filter(line => line.trim());
    return issueLines.map((line, index) => ({
      type: 'general',
      severity: 'medium' as const,
      line: index + 1,
      message: line.trim(),
      suggestion: 'Review and address this issue'
    }));
  }

  private extractSuggestions(analysis: string): string[] {
    const suggestionSection = analysis.match(/suggestions?[:\s]*\n(.*?)(?=\n\n|\n[A-Z]|$)/is);
    return suggestionSection ? suggestionSection[1].split('\n').filter(line => line.trim()) : [];
  }

  private assessComplexity(code: string): 'low' | 'medium' | 'high' {
    const lines = code.split('\n').length;
    const cyclomaticIndicators = (code.match(/\b(if|for|while|switch|catch|&&|\|\|)\b/g) || []).length;
    
    if (lines < 20 && cyclomaticIndicators < 3) return 'low';
    if (lines < 50 && cyclomaticIndicators < 8) return 'medium';
    return 'high';
  }

  private getDefaultTestFramework(language: string): string {
    const frameworks: Record<string, string> = {
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

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}