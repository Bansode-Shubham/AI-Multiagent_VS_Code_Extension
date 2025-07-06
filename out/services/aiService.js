"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
class AIService {
    constructor(groqApiKey, blackboxApiKey) {
        this.groq = new groq_sdk_1.default({ apiKey: groqApiKey });
        this.blackboxApiKey = blackboxApiKey;
    }
    async chatWithGroq(messages, model = "llama-3.1-8b-instant") {
        try {
            const completion = await this.groq.chat.completions.create({
                model,
                messages,
                temperature: 0.7,
            });
            return completion.choices[0]?.message?.content || "";
        }
        catch (error) {
            console.error('Groq API error:', error);
            throw error;
        }
    }
    // async chatWithDeepSeekR1(messages: ChatMessage[], temperature: number = 0.6): Promise<ChatResponse> {
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
    //   return response.json();
    // }
    async chatWithDeepSeekR1(messages, temperature = 0.6) {
        const url = 'https://api.blackbox.ai/chat/completions';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.blackboxApiKey}`
        };
        const data = {
            model: 'blackboxai/deepseek/deepseek-r1-distill-llama-8b',
            messages,
            temperature
        };
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
}
exports.AIService = AIService;
//# sourceMappingURL=aiService.js.map