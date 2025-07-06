import { ChatMessage, ChatResponse } from '../types';
export declare class AIService {
    private groq;
    private blackboxApiKey;
    constructor(groqApiKey: string, blackboxApiKey: string);
    chatWithGroq(messages: ChatMessage[], model?: string): Promise<string>;
    chatWithDeepSeekR1(messages: ChatMessage[], temperature?: number): Promise<ChatResponse>;
}
//# sourceMappingURL=aiService.d.ts.map