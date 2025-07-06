// import Groq from "groq-sdk";
// import { ChatMessage, ChatRequest, ChatResponse } from '../types';

// export class AIService {
//   private groq: Groq;
//   private blackboxApiKey: string;

//   constructor(groqApiKey: string, blackboxApiKey: string) {
//     this.groq = new Groq({ apiKey: groqApiKey });
//     this.blackboxApiKey = blackboxApiKey;
//   }

//   async chatWithGroq(messages: ChatMessage[], model: string = "llama-3.1-8b-instant"): Promise<string> {
//     try {
//       const completion = await this.groq.chat.completions.create({
//         model,
//         messages,
//         temperature: 0.7,
//       });
//       return completion.choices[0]?.message?.content || "";
//     } catch (error) {
//       console.error('Groq API error:', error);
//       throw error;
//     }
//   }

  
//   async chatWithDeepSeekR1(messages: ChatMessage[], temperature: number = 0.6): Promise<ChatResponse> {
//   const url = 'https://api.blackbox.ai/chat/completions';
  
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${this.blackboxApiKey}`
//   };

//   const data: ChatRequest = {
//     model: 'blackboxai/deepseek/deepseek-r1-distill-llama-8b',
//     messages,
//     temperature
//   };

//   const response = await fetch(url, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(data)
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return response.json() as Promise<ChatResponse>;
// }
// }


import Groq from "groq-sdk";
import { ChatMessage, ChatRequest, ChatResponse } from '../types';

export interface AIServiceConfig {
  groqApiKey: string;
  blackboxApiKey: string;
  defaultGroqModel?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface StreamingResponse {
  stream: ReadableStream<string>;
  controller: ReadableStreamDefaultController<string>;
}

export class AIService {
  private groq: Groq;
  private blackboxApiKey: string;
  private defaultGroqModel: string;
  private timeout: number;
  private maxRetries: number;

  constructor(groqApiKey: string, blackboxApiKey: string) {
    this.groq = new Groq({ apiKey: groqApiKey });
    this.blackboxApiKey = blackboxApiKey;
    this.defaultGroqModel = "llama-3.1-8b-instant";
    this.timeout = 30000;
    this.maxRetries = 3;
  }

  async chatWithGroq(
    messages: ChatMessage[], 
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const { model = this.defaultGroqModel, temperature = 0.7, maxTokens } = options;
    
    return this.withRetry(async () => {
      const completion = await this.groq.chat.completions.create({
        model,
        messages,
        temperature,
        ...(maxTokens && { max_tokens: maxTokens }),
        stream: false
      });

      return completion.choices[0]?.message?.content || "";
    });
  }

  async chatWithGroqStream(
    messages: ChatMessage[], 
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<StreamingResponse> {
    const { model = this.defaultGroqModel, temperature = 0.7, maxTokens } = options;
    
    const stream = await this.groq.chat.completions.create({
      model,
      messages,
      temperature,
      ...(maxTokens && { max_tokens: maxTokens }),
      stream: true
    });

    const readableStream = new ReadableStream<string>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(content);
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return {
      stream: readableStream,
      controller: readableStream.getReader() as any
    };
  }

  async chatWithDeepSeekR1(
    messages: ChatMessage[], 
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<ChatResponse> {
    const { temperature = 0.6, maxTokens } = options;
    
    return this.withRetry(async () => {
      const response = await this.fetchWithTimeout('https://api.blackbox.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.blackboxApiKey}`
        },
        body: JSON.stringify({
          model: 'blackboxai/deepseek/deepseek-r1-distill-llama-8b',
          messages,
          temperature,
          ...(maxTokens && { max_tokens: maxTokens })
        } as ChatRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
      }

      return response.json() as Promise<ChatResponse>;
    });
  }

  async chatWithMultipleProviders(
    messages: ChatMessage[],
    providers: Array<'groq' | 'deepseek'> = ['groq', 'deepseek']
  ): Promise<Array<{ provider: 'groq'; response: string } | { provider: 'deepseek'; response: ChatResponse }>> {
    const results = await Promise.allSettled(
      providers.map(async (provider): Promise<{ provider: 'groq'; response: string } | { provider: 'deepseek'; response: ChatResponse }> => {
        if (provider === 'groq') {
          const response = await this.chatWithGroq(messages);
          return { provider: 'groq', response };
        } else {
          const response = await this.chatWithDeepSeekR1(messages);
          return { provider: 'deepseek', response };
        }
      })
    );

    return results
      .filter((result): result is PromiseFulfilledResult<{ provider: 'groq'; response: string } | { provider: 'deepseek'; response: ChatResponse }> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  async validateApiKeys(): Promise<{ groq: boolean; blackbox: boolean }> {
    const testMessage: ChatMessage[] = [{ role: 'user', content: 'Hello' }];
    
    const [groqResult, blackboxResult] = await Promise.allSettled([
      this.chatWithGroq(testMessage).then(() => true).catch(() => false),
      this.chatWithDeepSeekR1(testMessage).then(() => true).catch(() => false)
    ]);

    return {
      groq: groqResult.status === 'fulfilled' ? groqResult.value : false,
      blackbox: blackboxResult.status === 'fulfilled' ? blackboxResult.value : false
    };
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.maxRetries) {
          throw lastError;
        }
        
        // Exponential backoff
        await this.delay(Math.pow(2, attempt - 1) * 1000);
      }
    }
    
    throw lastError!;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods
  getAvailableGroqModels(): string[] {
    return [
      "llama-3.1-8b-instant",
      "llama-3.1-70b-versatile",
      "llama-3.2-1b-preview",
      "llama-3.2-3b-preview",
      "gemma2-9b-it",
      "mixtral-8x7b-32768"
    ];
  }

  formatMessagesForContext(messages: ChatMessage[], maxLength: number = 4000): ChatMessage[] {
    const formatted = [...messages];
    let totalLength = JSON.stringify(formatted).length;
    
    while (totalLength > maxLength && formatted.length > 1) {
      formatted.shift(); // Remove oldest message
      totalLength = JSON.stringify(formatted).length;
    }
    
    return formatted;
  }

  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}