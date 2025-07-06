import Groq from "groq-sdk";
import { ChatMessage, ChatRequest, ChatResponse } from '../types';

export class AIService {
  private groq: Groq;
  private blackboxApiKey: string;

  constructor(groqApiKey: string, blackboxApiKey: string) {
    this.groq = new Groq({ apiKey: groqApiKey });
    this.blackboxApiKey = blackboxApiKey;
  }

  async chatWithGroq(messages: ChatMessage[], model: string = "llama-3.1-8b-instant"): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
      });
      return completion.choices[0]?.message?.content || "";
    } catch (error) {
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
  async chatWithDeepSeekR1(messages: ChatMessage[], temperature: number = 0.6): Promise<ChatResponse> {
  const url = 'https://api.blackbox.ai/chat/completions';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.blackboxApiKey}`
  };

  const data: ChatRequest = {
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

  return response.json() as Promise<ChatResponse>;
}
}