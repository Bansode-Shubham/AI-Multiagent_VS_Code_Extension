export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SecurityIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  line: number;
  message: string;
  suggestion: string;
}

export interface CodeSuggestion {
  type: 'completion' | 'improvement' | 'optimization';
  content: string;
  explanation: string;
}

