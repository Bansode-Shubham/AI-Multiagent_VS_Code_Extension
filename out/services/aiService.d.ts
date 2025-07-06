/// <reference types="node" />
import { ChatMessage, ChatResponse } from '../types';
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
export declare class AIService {
    private groq;
    private blackboxApiKey;
    private defaultGroqModel;
    private timeout;
    private maxRetries;
    constructor(groqApiKey: string, blackboxApiKey: string);
    chatWithGroq(messages: ChatMessage[], options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    }): Promise<string>;
    chatWithGroqStream(messages: ChatMessage[], options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    }): Promise<StreamingResponse>;
    chatWithDeepSeekR1(messages: ChatMessage[], options?: {
        temperature?: number;
        maxTokens?: number;
    }): Promise<ChatResponse>;
    chatWithMultipleProviders(messages: ChatMessage[], providers?: Array<'groq' | 'deepseek'>): Promise<Array<{
        provider: 'groq';
        response: string;
    } | {
        provider: 'deepseek';
        response: ChatResponse;
    }>>;
    validateApiKeys(): Promise<{
        groq: boolean;
        blackbox: boolean;
    }>;
    private withRetry;
    private fetchWithTimeout;
    private delay;
    getAvailableGroqModels(): string[];
    formatMessagesForContext(messages: ChatMessage[], maxLength?: number): ChatMessage[];
    estimateTokens(text: string): number;
}
//# sourceMappingURL=aiService.d.ts.map