// import * as vscode from 'vscode';
// import { AIService } from './services/aiService';
// import { CodingAgent } from './agents/codingAgent';
// import { SecurityAgent } from './agents/securityAgent';
// import { DocumentationAgent } from './agents/documentationAgent';
// import { AgentPanel } from './ui/agentPanel';

// export function activate(context: vscode.ExtensionContext) {
//   const config = vscode.workspace.getConfiguration('multiAgentAI');
//   const groqApiKey = config.get<string>('groqApiKey') || '';
//   const blackboxApiKey = config.get<string>('blackboxApiKey') || '';

//   if (!groqApiKey || !blackboxApiKey) {
//     vscode.window.showWarningMessage('Please configure API keys in settings for Multi-Agent AI extension');
//     return;
//   }

//   const aiService = new AIService(groqApiKey, blackboxApiKey);
//   const codingAgent = new CodingAgent(aiService);
//   const securityAgent = new SecurityAgent(aiService);
//   const documentationAgent = new DocumentationAgent(aiService);
//   const agentPanel = new AgentPanel(context.extensionUri);

//   // Generate Code Command
//   const generateCodeCommand = vscode.commands.registerCommand('multiAgentAI.generateCode', async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showErrorMessage('No active editor');
//       return;
//     }

//     const selection = editor.selection;
//     const selectedText = editor.document.getText(selection);
//     const language = editor.document.languageId;
//     const context = editor.document.getText();

//     try {
//       vscode.window.withProgress({
//         location: vscode.ProgressLocation.Notification,
//         title: "Generating code...",
//         cancellable: false
//       }, async () => {
//         const suggestion = await codingAgent.generateCodeCompletion(selectedText, language, context);
        
//         const action = await vscode.window.showInformationMessage(
//           'Code suggestion generated',
//           'Apply', 'View', 'Improve'
//         );

//         if (action === 'Apply') {
//           editor.edit(editBuilder => {
//             editBuilder.replace(selection, suggestion.content);
//           });
//         } else if (action === 'View') {
//           agentPanel.show();
//           agentPanel.updateContent('coding', suggestion.content);
//         } else if (action === 'Improve') {
//           const improvement = await codingAgent.suggestCodeImprovement(selectedText, language);
//           agentPanel.show();
//           agentPanel.updateContent('coding', improvement.content);
//         }
//       });
//     } catch (error) {
//       vscode.window.showErrorMessage(`Error generating code: ${error}`);
//     }
//   });

//   // Security Analysis Command
//   const analyzeSecurityCommand = vscode.commands.registerCommand('multiAgentAI.analyzeSecurity', async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showErrorMessage('No active editor');
//       return;
//     }

//     const code = editor.document.getText();
//     const language = editor.document.languageId;

//     try {
//       vscode.window.withProgress({
//         location: vscode.ProgressLocation.Notification,
//         title: "Analyzing security...",
//         cancellable: false
//       }, async () => {
//         const issues = await securityAgent.analyzeSecurityIssues(code, language);
        
//         if (issues.length === 0) {
//           vscode.window.showInformationMessage('No security issues found');
//           return;
//         }

//         agentPanel.show();
//         const issuesText = issues.map(issue => 
//           `**${issue.type.toUpperCase()}** (${issue.severity})\nLine ${issue.line}: ${issue.message}\n\nSuggestion: ${issue.suggestion}\n\n---\n`
//         ).join('');
        
//         agentPanel.updateContent('security', issuesText);
        
//         // Show diagnostics
//         const diagnostics = issues.map(issue => {
//           const range = new vscode.Range(issue.line - 1, 0, issue.line - 1, 100);
//           const severity = issue.severity === 'high' ? vscode.DiagnosticSeverity.Error :
//                           issue.severity === 'medium' ? vscode.DiagnosticSeverity.Warning :
//                           vscode.DiagnosticSeverity.Information;
          
//           return new vscode.Diagnostic(range, issue.message, severity);
//         });

//         const collection = vscode.languages.createDiagnosticCollection('multiAgentAI');
//         collection.set(editor.document.uri, diagnostics);
//       });
//     } catch (error) {
//       vscode.window.showErrorMessage(`Error analyzing security: ${error}`);
//     }
//   });

//   // Generate Documentation Command
//   const generateDocsCommand = vscode.commands.registerCommand('multiAgentAI.generateDocs', async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showErrorMessage('No active editor');
//       return;
//     }

//     const selection = editor.selection;
//     const selectedText = editor.document.getText(selection) || editor.document.getText();
//     const language = editor.document.languageId;

//     try {
//       vscode.window.withProgress({
//         location: vscode.ProgressLocation.Notification,
//         title: "Generating documentation...",
//         cancellable: false
//       }, async () => {
//         const docs = await documentationAgent.generateCodeDocumentation(selectedText, language);
        
//         agentPanel.show();
//         agentPanel.updateContent('documentation', docs);
        
//         const action = await vscode.window.showInformationMessage(
//           'Documentation generated',
//           'Insert Above', 'Insert Below', 'Copy'
//         );

//         if (action === 'Insert Above') {
//           editor.edit(editBuilder => {
//             editBuilder.insert(selection.start, `/*\n${docs}\n*/\n`);
//           });
//         } else if (action === 'Insert Below') {
//           editor.edit(editBuilder => {
//             editBuilder.insert(selection.end, `\n/*\n${docs}\n*/`);
//           });
//         } else if (action === 'Copy') {
//           vscode.env.clipboard.writeText(docs);
//         }
//       });
//     } catch (error) {
//       vscode.window.showErrorMessage(`Error generating documentation: ${error}`);
//     }
//   });

//   // Open Panel Command
//   const openPanelCommand = vscode.commands.registerCommand('multiAgentAI.openPanel', () => {
//     agentPanel.show();
//   });

//   context.subscriptions.push(
//     generateCodeCommand,
//     analyzeSecurityCommand,
//     generateDocsCommand,
//     openPanelCommand
//   );

//   // Auto-completion provider
//   const completionProvider = vscode.languages.registerCompletionItemProvider(
//     { scheme: 'file' },
//     {
//       async provideCompletionItems(document, position) {
//         const lineText = document.lineAt(position).text;
//         const range = new vscode.Range(position.line, 0, position.line, position.character);
        
//         try {
//           const suggestion = await codingAgent.generateCodeCompletion(
//             lineText,
//             document.languageId,
//             document.getText()
//           );
          
//           const completionItem = new vscode.CompletionItem(
//             suggestion.content,
//             vscode.CompletionItemKind.Text
//           );
//           completionItem.insertText = suggestion.content;
//           completionItem.range = range;
//           completionItem.detail = 'AI Generated';
          
//           return [completionItem];
//         } catch {
//           return [];
//         }
//       }
//     },
//     '.' // Trigger on dot
//   );

//   context.subscriptions.push(completionProvider);
// }

import * as vscode from 'vscode';
import { AIService } from './services/aiService';
import { CodingAgent } from './agents/codingAgent';
import { SecurityAgent } from './agents/securityAgent';
import { DocumentationAgent } from './agents/documentationAgent';
import { AgentPanel } from './ui/agentPanel';

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('multiAgentAI');
  const groqApiKey = config.get<string>('groqApiKey') || '';
  const blackboxApiKey = config.get<string>('blackboxApiKey') || '';

  if (!groqApiKey || !blackboxApiKey) {
    vscode.window.showWarningMessage('Please configure API keys in settings for Multi-Agent AI extension');
    return;
  }

  

  const aiService = new AIService(groqApiKey, blackboxApiKey);
  const codingAgent = new CodingAgent(aiService);
  const securityAgent = new SecurityAgent(aiService);
  const documentationAgent = new DocumentationAgent(aiService);
  const agentPanel = new AgentPanel(context.extensionUri);

  // Helper function for extracting completion text
  function extractCompletion(aiResponse: string, existingText: string): string {
    // Extract code from markdown if present
    const codeMatch = aiResponse.match(/```[\w]*\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[1] : aiResponse;
    
    // Remove the existing text from the beginning if it's repeated
    const lines = code.split('\n');
    let completionStart = 0;
    
    // Find where the new completion starts
    for (let i = 0; i < lines.length; i++) {
      if (!existingText.includes(lines[i].trim()) || lines[i].trim().length === 0) {
        completionStart = i;
        break;
      }
    }
    
    return lines.slice(completionStart).join('\n').trim();
  }

  // Inline completion provider for auto-suggestions
  const inlineCompletionProvider = vscode.languages.registerInlineCompletionItemProvider(
    { scheme: 'file' },
    {
      async provideInlineCompletionItems(document, position, context, token) {
        // Get current line and surrounding context
        const lineText = document.lineAt(position).text;
        const textBeforeCursor = lineText.substring(0, position.character);
        
        // Skip if line is empty or too short
        if (textBeforeCursor.trim().length < 3) {
          return [];
        }

        // Get more context (previous lines)
        const contextLines = Math.max(0, position.line - 10);
        const contextRange = new vscode.Range(contextLines, 0, position.line, position.character);
        const contextText = document.getText(contextRange);

        try {
          const suggestion = await codingAgent.generateCodeCompletion(
            contextText,
            document.languageId,
            {
              fileName: document.fileName,
              targetAudience: 'intermediate'
            }
          );

          // Extract only the completion part (remove the existing code)
          const completionText = extractCompletion(suggestion.content, textBeforeCursor);
          
          if (completionText && completionText.trim().length > 0) {
            const inlineCompletion = new vscode.InlineCompletionItem(
              completionText,
              new vscode.Range(position, position)
            );
            
            return [inlineCompletion];
          }
        } catch (error) {
          console.error('Inline completion error:', error);
        }

        return [];
      }
    }
  );

  // Enhanced completion provider with multiple triggers
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: 'file' },
    {
      async provideCompletionItems(document, position) {
        const lineText = document.lineAt(position).text;
        const textBeforeCursor = lineText.substring(0, position.character);
        
        // Skip if triggered inappropriately
        if (textBeforeCursor.trim().length < 2) {
          return [];
        }

        const range = new vscode.Range(position.line, 0, position.line, position.character);
        
        try {
          const suggestion = await codingAgent.generateCodeCompletion(
            lineText,
            document.languageId,
            document.getText()
          );
          
          const completionItem = new vscode.CompletionItem(
            suggestion.content,
            vscode.CompletionItemKind.Snippet
          );
          
          completionItem.insertText = new vscode.SnippetString(suggestion.content);
          completionItem.range = range;
          completionItem.detail = 'AI Generated';
          completionItem.documentation = suggestion.explanation;
          completionItem.sortText = '0'; // Prioritize AI suggestions
          
          return [completionItem];
        } catch {
          return [];
        }
      }
    },
    // Multiple triggers
    '.',    // Dot notation
    '(',    // Function calls
    '[',    // Array access
    '{',    // Object literals
    ' ',    // Space after keywords
    ':',    // Type annotations (TypeScript)
    '=',    // Assignments
    '<',    // Generic types
    '/'     // Comments
  );

  // Generate Code Command
  const generateCodeCommand = vscode.commands.registerCommand('multiAgentAI.generateCode', async () => {
    console.log('🔥 Generate code command started');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      console.log('❌ No active editor');
      vscode.window.showErrorMessage('No active editor');
      return;
    }
console.log('✅ Editor found');
  
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    const language = editor.document.languageId;
    const context = editor.document.getText();
console.log('📝 Selection:', selectedText.length, 'chars');
  console.log('🔤 Language:', language);
    try {
          console.log('🤖 Calling AI service...');

      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Generating code...",
        cancellable: false
      }, async () => {
        const suggestion = await codingAgent.generateCodeCompletion(selectedText, language, context);
            console.log('✨ Got suggestion:', suggestion);

        const action = await vscode.window.showInformationMessage(
          'Code suggestion generated',
          'Apply', 'View', 'Improve'
        );

        if (action === 'Apply') {
          editor.edit(editBuilder => {
            editBuilder.replace(selection, suggestion.content);
          });
        } else if (action === 'View') {
          agentPanel.show();
          agentPanel.updateContent('coding', suggestion.content);
        } else if (action === 'Improve') {
          const improvement = await codingAgent.suggestCodeImprovement(selectedText, language);
          agentPanel.show();
          agentPanel.updateContent('coding', improvement.content);
        }
      });
    } catch (error) {
       console.error('💥 Error:', error);
      vscode.window.showErrorMessage(`Error generating code: ${error}`);
    }
  });

  // Security Analysis Command
  const analyzeSecurityCommand = vscode.commands.registerCommand('multiAgentAI.analyzeSecurity', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const code = editor.document.getText();
    const language = editor.document.languageId;

    try {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Analyzing security...",
        cancellable: false
      }, async () => {
        const issues = await securityAgent.analyzeSecurityIssues(code, language);
        
        if (issues.length === 0) {
          vscode.window.showInformationMessage('No security issues found');
          return;
        }

        agentPanel.show();
        const issuesText = issues.map(issue => 
          `**${issue.type.toUpperCase()}** (${issue.severity})\nLine ${issue.line}: ${issue.message}\n\nSuggestion: ${issue.suggestion}\n\n---\n`
        ).join('');
        
        agentPanel.updateContent('security', issuesText);
        
        // Show diagnostics
        const diagnostics = issues.map(issue => {
          const range = new vscode.Range(issue.line - 1, 0, issue.line - 1, 100);
          const severity = issue.severity === 'high' ? vscode.DiagnosticSeverity.Error :
                          issue.severity === 'medium' ? vscode.DiagnosticSeverity.Warning :
                          vscode.DiagnosticSeverity.Information;
          
          return new vscode.Diagnostic(range, issue.message, severity);
        });

        const collection = vscode.languages.createDiagnosticCollection('multiAgentAI');
        collection.set(editor.document.uri, diagnostics);
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Error analyzing security: ${error}`);
    }
  });

  // Generate Documentation Command
  const generateDocsCommand = vscode.commands.registerCommand('multiAgentAI.generateDocs', async () => {
    console.log('Generate code command triggered'); // Add this
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection) || editor.document.getText();
    const language = editor.document.languageId;

    try {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Generating documentation...",
        cancellable: false
      }, async () => {
        const docs = await documentationAgent.generateCodeDocumentation(selectedText, language);
        
        agentPanel.show();
        agentPanel.updateContent('documentation', docs);
        
        const action = await vscode.window.showInformationMessage(
          'Documentation generated',
          'Insert Above', 'Insert Below', 'Copy'
        );

        if (action === 'Insert Above') {
          editor.edit(editBuilder => {
            editBuilder.insert(selection.start, `/*\n${docs}\n*/\n`);
          });
        } else if (action === 'Insert Below') {
          editor.edit(editBuilder => {
            editBuilder.insert(selection.end, `\n/*\n${docs}\n*/`);
          });
        } else if (action === 'Copy') {
          vscode.env.clipboard.writeText(docs);
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Error generating documentation: ${error}`);
    }
  });

  // Open Panel Command
  const openPanelCommand = vscode.commands.registerCommand('multiAgentAI.openPanel', () => {
    agentPanel.show();
  });

  // Accept inline suggestion command
  const acceptInlineSuggestionCommand = vscode.commands.registerCommand('multiAgentAI.acceptInlineSuggestion', () => {
    vscode.commands.executeCommand('editor.action.inlineSuggest.commit');
  });

  context.subscriptions.push(
    generateCodeCommand,
    analyzeSecurityCommand,
    generateDocsCommand,
    openPanelCommand,
    acceptInlineSuggestionCommand,
    completionProvider,
    inlineCompletionProvider
  );

  // Status bar item for AI assistance
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(robot) AI";
  statusBarItem.tooltip = "Multi-Agent AI Assistant";
  statusBarItem.command = 'multiAgentAI.openPanel';
  statusBarItem.show();
  
  context.subscriptions.push(statusBarItem);
  console.log('Multi-Agent AI extension activated');
  

}