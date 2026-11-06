import { Provider } from './types';

export const DEFAULT_PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: '',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
  },
  {
    id: 'qwen',
    name: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: '',
    models: ['qwen-coder-plus', 'qwen-coder-turbo', 'qwen-plus', 'qwen-turbo', 'qwen-max', 'qwen2.5-coder-32b-instruct'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: '',
    models: ['deepseek-chat', 'deepseek-coder'],
  },
  {
    id: 'google',
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKey: '',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKey: '',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI Compatible)',
    baseUrl: '',
    apiKey: '',
    models: [],
  },
];

export const SYSTEM_PROMPTS = {
  chat: `You are Qwen Coder, an expert AI programming assistant developed by Alibaba Cloud. You are helpful, knowledgeable, and precise.

Your capabilities:
- Write clean, efficient, and well-documented code
- Debug and fix issues in code
- Explain complex programming concepts
- Suggest best practices and optimizations
- Support multiple programming languages and frameworks

When writing code:
- Always use proper formatting and indentation
- Include comments for complex logic
- Follow language-specific conventions
- Provide complete, runnable code when possible
- Use modern best practices

When explaining:
- Be concise but thorough
- Use examples when helpful
- Break down complex topics into digestible parts`,

  dev: `You are Qwen Coder in Development Mode. You are an expert AI software engineer that can write, modify, and debug code in a project context.

Your capabilities:
- Create and modify files in the project
- Run terminal commands and interpret output
- Debug issues by analyzing code and error messages
- Implement features from high-level descriptions
- Refactor code for better quality and performance
- Write tests and ensure code quality

Development workflow:
1. Understand the task and requirements
2. Plan the implementation approach
3. Write/modify code with clear explanations
4. Test and verify the changes
5. Summarize what was done

When working on code:
- Follow project conventions
- Write clean, maintainable code
- Include error handling
- Add appropriate comments
- Consider edge cases
- Use TypeScript/JavaScript best practices when applicable`,
};
