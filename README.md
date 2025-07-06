# Multi-Agent Developer Tools

AI-powered coding, security, and documentation assistant with multiple specialized agents for VS Code.

## Features

### 🤖 Smart Code Enhancement
- **Inline completions** - Auto-suggestions as you type
- **Code improvement suggestions** - Analyzes and enhances selected code
- **Context-aware generation** - Understands your codebase
- **Multi-language support** - Works with all major programming languages
- **Intelligent completion triggers** - Activates on `.`, `(`, `[`, `{`, etc.

### 🔒 Security Analysis
- **Vulnerability detection** - Identifies security issues in your code
- **Real-time diagnostics** - Shows issues directly in the editor
- **Severity classification** - Categorizes issues by risk level
- **Actionable suggestions** - Provides specific fix recommendations

### 📚 Documentation Generation
- **Auto-generate docs** - Creates comprehensive documentation
- **Multiple insertion options** - Insert above, below, or copy to clipboard
- **Language-specific formatting** - Adapts to your programming language
- **Context-aware content** - Understands code structure and purpose

## Installation

1. Install the extension from VS Code marketplace
2. Configure your API keys in VS Code settings:
   - `multiAgentAI.groqApiKey` - Your Groq API key
   - `multiAgentAI.blackboxApiKey` - Your Blackbox API key

## Usage

### Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| **AI: Generate Code** | `Ctrl+Shift+G` | Generate or improve code based on selection |
| **AI: Analyze Security** | `Ctrl+Shift+S` | Analyze code for security vulnerabilities |
| **AI: Generate Documentation** | `Ctrl+Shift+D` | Generate documentation for selected code |
| **AI: Open Agent Panel** | - | Open the AI assistant panel |
| **AI: Accept Inline Suggestion** | `Ctrl+Shift+A` | Accept the current inline suggestion |

### Inline Completions

The extension provides intelligent code completions as you type:

- Activates when you type 3+ characters
- Uses surrounding context for better suggestions
- Supports all file types
- Configurable trigger characters

### Agent Panel

Access the AI assistant panel via:
- Command palette: `AI: Open Agent Panel`
- Status bar: Click the robot icon
- Right-click context menu

## Configuration

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `multiAgentAI.groqApiKey` | `""` | Groq API Key for AI services |
| `multiAgentAI.blackboxApiKey` | `""` | Blackbox API Key for DeepSeek R1 |
| `multiAgentAI.inlineCompletions` | `true` | Enable inline code completions |
| `multiAgentAI.completionTriggers` | `[".", "(", "[", "{", " ", ":", "=", "<", "/"]` | Characters that trigger completion |
| `multiAgentAI.autoSuggestDelay` | `500` | Delay before showing suggestions (ms) |
| `multiAgentAI.maxContextLines` | `10` | Max lines used for context |

### API Keys Setup

1. Open VS Code settings (`Ctrl+,`)
2. Search for "Multi-Agent AI"
3. Enter your API keys:
   - **Groq API Key**: Get from [Groq Console](https://console.groq.com/)
   - **Blackbox API Key**: Get from [Blackbox AI](https://blackbox.ai/)

## Examples

### Code Generation
```typescript
// Type a comment and get instant code
// TODO: Create a function to validate email
// → AI generates the complete function
```

### Security Analysis
```javascript
// Detects issues like:
eval(userInput); // ⚠️ HIGH: Code injection vulnerability
document.write(data); // ⚠️ MEDIUM: XSS vulnerability
```

### Documentation
```python
def complex_algorithm(data, threshold=0.5):
    # Select code and generate docs
    # → AI creates comprehensive documentation
```

## Supported Languages

- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- PHP
- Ruby
- And many more...

## Troubleshooting

### Common Issues

**No suggestions appearing?**
- Check API keys are configured
- Ensure you're typing 3+ characters
- Verify file is saved with correct extension

**Security analysis not working?**
- Confirm Groq API key is valid
- Check file contains actual code (not just comments)
- Try refreshing the window

**Documentation generation fails?**
- Select actual code (not whitespace)
- Ensure API keys are properly configured
- Check network connectivity

## Privacy & Security

- Code is sent to AI providers for processing
- No code is stored permanently
- API keys are stored locally in VS Code
- All communication uses HTTPS

## Support

- **Issues**: Report on GitHub
- **Feature requests**: Open an issue
- **Documentation**: Check VS Code command palette

## Requirements

- VS Code 1.101.0 or higher
- Valid API keys from Groq and Blackbox
- Internet connection for AI services

## Release Notes

### 0.0.12
- Enhanced inline completions
- Improved security analysis
- Better documentation generation
- Added configurable settings

---

**Enjoy coding with AI assistance!** 🚀