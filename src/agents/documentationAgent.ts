import { AIService } from '../services/aiService';
import { ChatMessage } from '../types';

export class DocumentationAgent {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async generateCodeDocumentation(code: string, language: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a technical documentation expert. Generate comprehensive documentation including:
        - Function/class descriptions
        - Parameter explanations
        - Return value descriptions
        - Usage examples
        - Edge cases and error handling`
      },
      {
        role: 'user',
        content: `Language: ${language}\n\nCode to document:\n${code}`
      }
    ];

    return await this.aiService.chatWithGroq(messages);
  }

  async generateErrorResolutionDocs(error: string, code: string, language: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an error resolution expert. Create detailed documentation for error fixes including:
        - Error explanation
        - Root cause analysis
        - Step-by-step resolution
        - Prevention strategies
        - Related resources`
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

  async generateAPIDocumentation(code: string, language: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an API documentation specialist. Generate comprehensive API documentation with:
        - Endpoint descriptions
        - Request/response formats
        - Authentication requirements
        - Error codes and handling
        - Usage examples`
      },
      {
        role: 'user',
        content: `Language: ${language}\n\nAPI code:\n${code}`
      }
    ];

    return await this.aiService.chatWithGroq(messages);
  }

  async generateTroubleshootingGuide(issue: string, context: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a troubleshooting expert. Create a comprehensive troubleshooting guide with:
        - Problem identification
        - Diagnostic steps
        - Common solutions
        - Advanced troubleshooting
        - Prevention measures`
      },
      {
        role: 'user',
        content: `Issue: ${issue}\nContext: ${context}`
      }
    ];

    return await this.aiService.chatWithGroq(messages);
  }
}