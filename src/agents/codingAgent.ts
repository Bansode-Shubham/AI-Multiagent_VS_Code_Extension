import { AIService } from '../services/aiService';
import { ChatMessage, CodeSuggestion } from '../types';

export class CodingAgent {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async generateCodeCompletion(code: string, language: string, context: string): Promise<CodeSuggestion> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a coding assistant specializing in ${language}. Provide code completions and improvements. Focus on:
        - Clean, efficient code
        - Best practices
        - Performance optimization
        - Readability`
      },
      {
        role: 'user',
        content: `Context: ${context}\n\nCurrent code:\n${code}\n\nProvide a completion or improvement suggestion.`
      }
    ];

    const response = await this.aiService.chatWithGroq(messages);
    
    return {
      type: 'completion',
      content: response,
      explanation: 'AI-generated code completion based on context and best practices'
    };
  }

  async suggestCodeImprovement(code: string, language: string): Promise<CodeSuggestion> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a code review expert. Analyze the code and suggest improvements for:
        - Performance
        - Readability
        - Maintainability
        - Error handling`
      },
      {
        role: 'user',
        content: `Language: ${language}\n\nCode to review:\n${code}`
      }
    ];

    const response = await this.aiService.chatWithGroq(messages);
    
    return {
      type: 'improvement',
      content: response,
      explanation: 'Code improvement suggestions based on best practices'
    };
  }

  async optimizeCode(code: string, language: string): Promise<CodeSuggestion> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a performance optimization expert. Analyze the code and suggest optimizations while maintaining functionality.`
      },
      {
        role: 'user',
        content: `Language: ${language}\n\nCode to optimize:\n${code}`
      }
    ];

    const response = await this.aiService.chatWithGroq(messages);
    
    return {
      type: 'optimization',
      content: response,
      explanation: 'Performance optimization suggestions'
    };
  }
}
