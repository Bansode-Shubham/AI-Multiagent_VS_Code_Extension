Multi-Agent AI VS Code Extension
A powerful AI-powered coding assistant that brings multiple specialized AI agents directly into your VS Code workflow. Get intelligent code completion, security analysis, and automated documentation generation - all powered by cutting-edge AI models.
🚀 Features
🤖 Multiple AI Agents

Coding Agent: Intelligent code completion, improvements, and optimizations
Security Agent: Static code analysis and vulnerability detection
Documentation Agent: Automated documentation generation and error resolution guides

🔧 AI Models

Groq: Lightning-fast inference with Llama 3.1 models
DeepSeek R1: Advanced reasoning capabilities via Blackbox AI

⚡ Key Capabilities

Real-time code completion and suggestions
Security vulnerability scanning
Automated documentation generation
Error resolution guidance
Performance optimization suggestions
Multi-language support

📦 Installation
Prerequisites

VS Code 1.74.0 or higher
Node.js 16.x or higher
npm or yarn

Quick Install

Download the extension:
bash# Clone or download the extension files
git clone <repository-url>
cd multi-agent-ai

Install dependencies:
bashnpm install

Compile the extension:
bashnpm run compile

Package the extension:
bashnpm install -g vsce
vsce package

Install in VS Code:

Open VS Code
Go to Extensions (Ctrl+Shift+X)
Click "..." → "Install from VSIX..."
Select the generated .vsix file



⚙️ Configuration
API Keys Setup

Get your API keys:

Groq API: Visit console.groq.com and create an API key
Blackbox API: Visit blackbox.ai and get your API key


Configure in VS Code:

Open Settings (Ctrl+,)
Search for "Multi-Agent AI"
Enter your API keys:

Multi-Agent AI: Groq Api Key
Multi-Agent AI: Blackbox Api Key





🎮 Usage
Keyboard Shortcuts

Ctrl+Shift+G - Generate code completion/improvement
Ctrl+Shift+S - Analyze security vulnerabilities
Ctrl+Shift+D - Generate documentation
Ctrl+Shift+P → "AI:" - Access all AI commands

Command Palette
Open Command Palette (Ctrl+Shift+P) and search for:

AI: Generate Code - Get intelligent code suggestions
AI: Analyze Security - Scan for security issues
AI: Generate Documentation - Create comprehensive docs
AI: Open Agent Panel - View AI assistant panel

Auto-completion

Type code and press . to trigger AI-powered completions
Get context-aware suggestions based on your current code

🔍 Features in Detail
Coding Agent

Smart Completions: Context-aware code suggestions
Code Improvements: Refactoring and optimization recommendations
Best Practices: Follows language-specific coding standards
Performance Tips: Identifies optimization opportunities

Security Agent

Vulnerability Detection: Identifies common security issues
Dependency Scanning: Checks for known vulnerabilities in packages
Security Fixes: Provides specific remediation suggestions
Compliance Checks: Ensures code follows security best practices

Documentation Agent

Function Documentation: Generates comprehensive function docs
API Documentation: Creates detailed API reference guides
Error Resolution: Provides troubleshooting guides for errors
Code Comments: Adds meaningful inline documentation

📸 Screenshots
AI Agent Panel
┌─────────────────────────────────────────┐
│ Multi-Agent AI Assistant               │
├─────────────────────────────────────────┤
│ [Coding] [Security] [Documentation]     │
├─────────────────────────────────────────┤
│                                         │
│ 🤖 Coding Agent                        │
│ AI-powered code completion and          │
│ suggestions                             │
│                                         │
│ Generated code suggestions appear here  │
│                                         │
└─────────────────────────────────────────┘
Security Analysis
🔒 Security Issues Found:
❌ HIGH - SQL Injection vulnerability on line 42
⚠️  MEDIUM - Hardcoded API key detected on line 15
ℹ️  LOW - Missing input validation on line 28
🛠️ Development
Building from Source

Clone the repository:
bashgit clone <repository-url>
cd multi-agent-ai

Install dependencies:
bashnpm install

Start development:
bashnpm run watch

Debug:

Press F5 in VS Code to launch Extension Development Host
Test your changes in the new VS Code window



Project Structure
multi-agent-ai/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── types.ts              # TypeScript type definitions
│   ├── services/
│   │   └── aiService.ts      # AI service integration
│   ├── agents/
│   │   ├── codingAgent.ts    # Code generation agent
│   │   ├── securityAgent.ts  # Security analysis agent
│   │   └── documentationAgent.ts # Documentation agent
│   └── ui/
│       └── agentPanel.ts     # Web panel UI
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
🔧 Troubleshooting
Common Issues
Extension not loading

Check VS Code version (requires 1.74.0+)
Verify extension is enabled in Extensions panel
Check Developer Console for errors (Help → Toggle Developer Tools)

API errors

Verify API keys are correctly configured
Check API key permissions and credits
Ensure internet connection is stable

TypeScript compilation errors

Run npm install to ensure all dependencies are installed
Check Node.js version (requires 16.x+)
Verify tsconfig.json is properly configured

No AI responses

Confirm API keys are valid and have credits
Check network connectivity
Review VS Code Output panel for error messages

📋 Requirements
System Requirements

VS Code 1.74.0 or higher
Node.js 16.x or higher
Internet connection for AI API calls

API Requirements

Valid Groq API key with credits
Valid Blackbox API key with credits

🤝 Contributing
We welcome contributions! Please:

Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request

Development Guidelines

Follow TypeScript best practices
Add appropriate error handling
Update documentation for new features
Test thoroughly before submitting

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🆘 Support
Having issues? Here's how to get help:

Check the troubleshooting section above
Search existing issues on GitHub
Create a new issue with detailed information:

VS Code version
Extension version
Error messages
Steps to reproduce